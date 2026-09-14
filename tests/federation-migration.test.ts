import { exportJwk, generateCryptoKeyPair, type KvKey } from "@fedify/fedify";
import { NetlifyBlobsKvStore, type NetlifyBlobsStore } from "@fedify/netlify";
import { beforeAll, describe, expect, test } from "vitest";
import { spawnSync } from "node:child_process";
import {
  encodeMigrationKey,
  migrateFederation,
  type SourceEntry,
} from "../scripts/federation-migration";
import { storageReadyKey } from "../src/lib/federation/storage";

class TestStore implements NetlifyBlobsStore {
  entries = new Map<
    string,
    { data: unknown; metadata: Record<string, unknown>; etag: string }
  >();
  writes = 0;
  failAfter = Infinity;
  async getWithMetadata(key: string) {
    return this.entries.get(key) ?? null;
  }
  async setJSON(
    key: string,
    data: unknown,
    options: Parameters<NetlifyBlobsStore["setJSON"]>[2] = {},
  ) {
    if (this.writes >= this.failAfter) throw new Error("injected failure");
    const previous = this.entries.get(key);
    if (
      (options.onlyIfNew && previous != null) ||
      (options.onlyIfMatch != null && options.onlyIfMatch !== previous?.etag)
    )
      return { modified: false };
    const etag = String(++this.writes);
    this.entries.set(key, {
      data: structuredClone(data),
      metadata: options.metadata ?? {},
      etag,
    });
    return { modified: true, etag };
  }
  async delete(key: string) {
    this.entries.delete(key);
  }
  async *list() {
    yield { blobs: [...this.entries.keys()].map((key) => ({ key })) };
  }
}

let baseline: SourceEntry[];
const options = {
  origin: "https://writings.hongminhee.org",
  apply: true,
  quiesced: true,
};
beforeAll(async () => {
  const pairs = await Promise.all([
    generateCryptoKeyPair("RSASSA-PKCS1-v1_5"),
    generateCryptoKeyPair("Ed25519"),
  ]);
  const keys = await Promise.all(
    pairs.map(async (pair) => ({
      privateKey: await exportJwk(pair.privateKey),
      publicKey: await exportJwk(pair.publicKey),
    })),
  );
  baseline = [
    {
      key: ["writings", "federation", "keys", "hongminhee"],
      value: keys,
      expiresAt: null,
    },
    {
      key: ["writings", "federation", "sync", "initialized"],
      value: 2,
      expiresAt: null,
    },
    {
      key: ["writings", "federation", "followers", "https://example.com/@a"],
      value: {
        id: "https://example.com/@a",
        inboxId: "https://example.com/inbox",
      },
      expiresAt: null,
    },
  ];
});

describe("offline federation migration", () => {
  test("CLI rejects ambient Blobs context before reading or writing either backend", () => {
    const result = spawnSync(
      process.execPath,
      ["scripts/migrate-federation.ts", "--apply", "--quiesced"],
      {
        encoding: "utf8",
        env: { NETLIFY_BLOBS_CONTEXT: "test-context" },
      },
    );
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("without NETLIFY_BLOBS_CONTEXT");
    expect(result.stdout).toBe("");
  });
  test("dry run has no writes; apply requires confirmed quiescence", async () => {
    const store = new TestStore();
    await migrateFederation(baseline, store, { origin: options.origin });
    expect(store.writes).toBe(0);
    await expect(
      migrateFederation(baseline, store, { ...options, quiesced: false }),
    ).rejects.toThrow("quiesced");
    expect(store.writes).toBe(0);
  });
  test("preserves exact TTLs and data in the real adapter, with readiness last", async () => {
    const store = new TestStore();
    const expiry = Date.now() + 60_000;
    const entry = {
      key: [
        "_fedify",
        "activityIdempotence",
        "https://example.com/#한글?",
      ] as const,
      value: true,
      expiresAt: expiry,
    };
    await migrateFederation([...baseline, entry], store, options);
    const kv = new NetlifyBlobsKvStore(store);
    expect(await kv.get(entry.key)).toBe(true);
    expect(
      store.entries.get(encodeMigrationKey(entry.key))?.metadata["expireIn"],
    ).toBe(expiry);
    expect([...store.entries.keys()].at(-1)).toBe(
      encodeMigrationKey(storageReadyKey),
    );
    expect(await kv.get(baseline[0]!.key as KvKey)).toEqual(baseline[0]!.value);
    await expect(migrateFederation(baseline, store, options)).rejects.toThrow(
      "already marked ready",
    );
  });
  test("preflights oversized keys and conflicting destinations before writes", async () => {
    for (const extra of [
      { key: ["x".repeat(600)], value: 1, expiresAt: null },
      {
        key: ["writings", "federation", "sync", "lock"],
        value: "lock",
        expiresAt: Date.now() + 60_000,
      },
      {
        key: ["fedify", "netlify", "ordering", "fedify:queue", "actor"],
        value: {
          nextSequence: 2,
          completedSequence: 0,
          cancelledSequences: [],
        },
        expiresAt: null,
      },
    ]) {
      const store = new TestStore();
      await expect(
        migrateFederation([...baseline, extra], store, options),
      ).rejects.toThrow();
      expect(store.writes).toBe(0);
    }
    const store = new TestStore();
    await store.setJSON("unknown", 1);
    await expect(migrateFederation(baseline, store, options)).rejects.toThrow(
      "conflicting live",
    );
    expect(store.writes).toBe(1);
  });
  test("refuses missing identity and does not mark failed copies ready", async () => {
    const store = new TestStore();
    await expect(
      migrateFederation(baseline.slice(1), store, options),
    ).rejects.toThrow("actor key");
    store.failAfter = 1;
    await expect(migrateFederation(baseline, store, options)).rejects.toThrow(
      "injected",
    );
    expect(
      await store.getWithMetadata(encodeMigrationKey(storageReadyKey)),
    ).toBeNull();
    store.failAfter = Infinity;
    expect((await migrateFederation(baseline, store, options)).unchanged).toBe(
      1,
    );
  });
  test("resumes when a partial copy expired and conditionally replaces expired blobs", async () => {
    const store = new TestStore();
    const expired = { key: ["expired"], value: true, expiresAt: 100 };
    await store.setJSON(encodeMigrationKey(expired.key), true, {
      metadata: { expireIn: 100 },
    });
    await store.setJSON(encodeMigrationKey(baseline[2]!.key), "old", {
      metadata: { expireIn: 50 },
    });
    const result = await migrateFederation([...baseline, expired], store, {
      ...options,
      now: () => 200,
    });
    expect(result.expired).toBe(1);
    expect(
      await new NetlifyBlobsKvStore(store).get(baseline[2]!.key as KvKey),
    ).toEqual(baseline[2]!.value);
  });
  test("canonical equality allows JSON key order differences", async () => {
    const store = new TestStore();
    const entry = { key: ["cache"], value: { a: 1, b: 2 }, expiresAt: null };
    await store.setJSON(
      encodeMigrationKey(entry.key),
      { b: 2, a: 1 },
      { metadata: { expireIn: null } },
    );
    expect(
      (await migrateFederation([...baseline, entry], store, options)).unchanged,
    ).toBe(1);
  });
});
