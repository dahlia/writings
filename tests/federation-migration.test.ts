import { exportJwk, generateCryptoKeyPair, type KvKey } from "@fedify/fedify";
import { NetlifyBlobsKvStore, type NetlifyBlobsStore } from "@fedify/netlify";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { spawnSync } from "node:child_process";
import {
  encodeMigrationKey,
  isRebuildableCache,
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
  test("drops only recognized refetchable cache layouts, not replay or application state", async () => {
    const caches = [
      ["_fedify", "publicKey", "remote"],
      ["_fedify", "publicKey", "__fetchError", "remote"],
      ["_fedify", "remoteDocument", "remote"],
      ["_fedify", "httpMessageSignaturesSpec", "remote"],
    ];
    for (const key of caches) expect(isRebuildableCache(key)).toBe(true);
    const retained = [
      "activityIdempotence",
      "acceptSignatureNonce",
      "taskDeduplication",
      "circuit",
      "unknown",
    ].map((kind) => ({
      key: ["_fedify", kind, "remote"],
      value: true,
      expiresAt: null,
    }));
    retained.push({
      key: ["_fedify", "publicKey", "unknown", "layout"],
      value: true,
      expiresAt: null,
    });
    for (const entry of [...baseline, ...retained])
      expect(isRebuildableCache(entry.key)).toBe(false);
    const store = new TestStore();
    const result = await migrateFederation(
      [
        ...baseline,
        ...retained,
        ...caches.map((key) => ({ key, value: "cache", expiresAt: null })),
        {
          key: ["_fedify", "publicKey", "x".repeat(600)],
          value: "oversized cache",
          expiresAt: null,
        },
      ],
      store,
      options,
    );
    expect(result.skippedCache).toBe(5);
    expect(result.selected).toBe(baseline.length + retained.length);
    for (const entry of retained)
      expect(store.entries.has(encodeMigrationKey(entry.key))).toBe(true);
    for (const key of caches)
      expect(store.entries.has(encodeMigrationKey(key))).toBe(false);
  });
  test("thousands of caches need no destination requests and dry-run reads selected keys once", async () => {
    const store = new TestStore();
    const reads = vi.spyOn(store, "getWithMetadata");
    const cache = Array.from({ length: 8301 }, (_, n) => ({
      key: ["_fedify", "publicKey", String(n)],
      value: null,
      expiresAt: null,
    }));
    const result = await migrateFederation([...baseline, ...cache], store, {
      origin: options.origin,
    });
    expect(result).toMatchObject({
      selected: 3,
      skippedCache: 8301,
      copied: 0,
    });
    expect(reads).toHaveBeenCalledTimes(4);
    expect(store.writes).toBe(0);
  });
  test("bounded workers stop scheduling after failure and settle in-flight writes before rejecting", async () => {
    const store = new TestStore();
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const original = store.setJSON.bind(store);
    const write = vi
      .spyOn(store, "setJSON")
      .mockImplementation(async (key, data, opts) => {
        if (key === encodeMigrationKey(baseline[0]!.key)) {
          await gate;
          return original(key, data, opts);
        }
        throw new Error("injected concurrent failure");
      });
    let settled = false;
    const outcome = migrateFederation(baseline, store, {
      ...options,
      concurrency: 2,
    })
      .then(
        () => null,
        (error: unknown) => error,
      )
      .finally(() => {
        settled = true;
      });
    await vi.waitFor(() => expect(write).toHaveBeenCalledTimes(2));
    expect(settled).toBe(false);
    release();
    expect(await outcome).toMatchObject({
      message: "injected concurrent failure",
    });
    expect(write).toHaveBeenCalledTimes(2);
    expect(store.entries.has(encodeMigrationKey(storageReadyKey))).toBe(false);
    expect(store.writes).toBe(1);
  });
  test("parallel reads respect the limit and complete preflight before any writes", async () => {
    const store = new TestStore();
    let active = 0;
    let peak = 0;
    const read = store.getWithMetadata.bind(store);
    vi.spyOn(store, "getWithMetadata").mockImplementation(async (key) => {
      active++;
      peak = Math.max(peak, active);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2));
        return await read(key);
      } finally {
        active--;
      }
    });
    await migrateFederation(baseline, store, { ...options, concurrency: 2 });
    expect(peak).toBe(2);
    expect(active).toBe(0);
    expect([...store.entries.keys()].at(-1)).toBe(
      encodeMigrationKey(storageReadyKey),
    );
    for (const concurrency of [0, 17, 1.5, NaN]) {
      await expect(
        migrateFederation(baseline, new TestStore(), {
          ...options,
          concurrency,
        }),
      ).rejects.toThrow("Concurrency");
    }
  });
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
