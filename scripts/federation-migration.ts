import { importJwk } from "@fedify/fedify";
import type { NetlifyBlobsStore } from "@fedify/netlify";
import canonicalize from "json-canon";
import { storageReadyKey } from "../src/lib/federation/storage.ts";

export class MigrationError extends Error {}

export interface SourceEntry {
  readonly key: readonly string[];
  readonly value: unknown;
  readonly expiresAt: number | null;
}

// Default prefixes in Fedify 2.4.0-dev.1936.  Keep unknown layouts and all
// replay/task/nonce/circuit state; only these caches can be refetched safely.
export function isRebuildableCache(key: readonly string[]): boolean {
  return (
    key[0] === "_fedify" &&
    ((key.length === 3 &&
      ["publicKey", "remoteDocument", "httpMessageSignaturesSpec"].includes(
        key[1]!,
      )) ||
      (key.length === 4 && key[1] === "publicKey" && key[2] === "__fetchError"))
  );
}

async function forEachConcurrent<T>(
  items: readonly T[],
  concurrency: number,
  action: (item: T) => Promise<void>,
): Promise<void> {
  let index = 0;
  let failed = false;
  let failure: unknown;
  await Promise.all(
    Array.from({ length: Math.min(items.length, concurrency) }, async () => {
      while (!failed && index < items.length) {
        const item = items[index++]!;
        try {
          await action(item);
        } catch (error) {
          if (!failed) failure = error;
          failed = true;
        }
      }
    }),
  );
  // Settle every in-flight operation before returning an error to the operator.
  if (failed) throw failure;
}

// Pinned to @fedify/netlify 2.4.0-dev.1936.  Migration needs absolute TTLs;
// KvStore.list() does not expose them and set() would restart their lifetime.
export function encodeMigrationKey(key: readonly string[]): string {
  if (
    !Array.isArray(key) ||
    key.length === 0 ||
    !key.every((part) => typeof part === "string" && part.isWellFormed())
  ) {
    throw new MigrationError("Invalid source key.");
  }
  const encoded = `fedify1.${key.map((part) => Buffer.from(part).toString("base64url")).join(".")}.`;
  if (Buffer.byteLength(encoded) > 600) {
    throw new MigrationError(
      "Encoded source key exceeds 600 bytes; inspect legacy keys separately before retrying. Never discard idempotence records.",
    );
  }
  return encoded;
}

type BlobEntry = NonNullable<
  Awaited<ReturnType<NetlifyBlobsStore["getWithMetadata"]>>
>;
const readyBlobKey = encodeMigrationKey(storageReadyKey);
const readOptions = { type: "json", consistency: "strong" } as const;

function expired(expiresAt: number | null, now: number): boolean {
  return expiresAt != null && expiresAt <= now;
}

function blobAbsent(entry: BlobEntry, now: number): boolean {
  return (
    entry.metadata["tombstone"] === true ||
    (typeof entry.metadata["expireIn"] === "number" &&
      entry.metadata["expireIn"] <= now)
  );
}

function matches(source: SourceEntry, target: BlobEntry): boolean {
  return (
    target.metadata["tombstone"] !== true &&
    (target.metadata["expireIn"] ?? null) === source.expiresAt &&
    canonicalize(target.data) === canonicalize(source.value)
  );
}

async function validateSource(entries: readonly SourceEntry[]): Promise<void> {
  const find = (...key: string[]) =>
    entries.find((entry) => canonicalize(entry.key) === canonicalize(key));
  const keys = find("writings", "federation", "keys", "hongminhee");
  if (
    keys == null ||
    keys.expiresAt != null ||
    !Array.isArray(keys.value) ||
    keys.value.length !== 2
  ) {
    throw new MigrationError("Missing or invalid persistent actor key pairs.");
  }
  try {
    const algorithms = new Set<string>();
    for (const pair of keys.value) {
      const privateKey = await importJwk(pair.privateKey, "private");
      const publicKey = await importJwk(pair.publicKey, "public");
      const algorithm = privateKey.algorithm.name;
      const challenge = new TextEncoder().encode(
        "writings migration key check",
      );
      const signature = await crypto.subtle.sign(
        algorithm,
        privateKey,
        challenge,
      );
      if (
        !(await crypto.subtle.verify(
          algorithm,
          publicKey,
          signature,
          challenge,
        ))
      )
        throw new MigrationError();
      algorithms.add(algorithm);
    }
    if (!algorithms.has("RSASSA-PKCS1-v1_5") || !algorithms.has("Ed25519"))
      throw new MigrationError();
  } catch {
    throw new MigrationError("Invalid or mismatched actor key pairs.");
  }
  const initialized = find("writings", "federation", "sync", "initialized");
  if (initialized?.value !== 2 || initialized.expiresAt != null) {
    throw new MigrationError("Missing publication sync state version 2.");
  }
  if (find("writings", "federation", "sync", "lock") != null) {
    throw new MigrationError(
      "Publication sync lock is still live; wait for it to expire.",
    );
  }
  for (const entry of entries) {
    if (entry.key.slice(0, 3).join("/") === "fedify/netlify/ordering") {
      const value = entry.value as Record<string, unknown> | null;
      if (
        value == null ||
        !Number.isSafeInteger(value["nextSequence"]) ||
        !Number.isSafeInteger(value["completedSequence"]) ||
        (value["nextSequence"] as number) < 1 ||
        value["completedSequence"] !== (value["nextSequence"] as number) - 1 ||
        !Array.isArray(value["cancelledSequences"]) ||
        value["cancelledSequences"].length !== 0
      ) {
        throw new MigrationError("Queue ordering state is not drained.");
      }
    }
  }
}

export async function migrateFederation(
  source: readonly SourceEntry[],
  store: NetlifyBlobsStore,
  options: {
    readonly origin: string;
    readonly apply?: boolean;
    readonly quiesced?: boolean;
    readonly now?: () => number;
    readonly concurrency?: number;
  },
): Promise<{
  copied: number;
  unchanged: number;
  expired: number;
  ready: boolean;
  skippedCache: number;
  selected: number;
}> {
  if (options.apply && !options.quiesced)
    throw new MigrationError("Apply requires --quiesced.");
  const now = options.now ?? Date.now;
  const concurrency = options.concurrency ?? 4;
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16) {
    throw new MigrationError("Concurrency must be an integer from 1 to 16.");
  }
  let expiredCount = 0;
  let skippedCache = 0;
  const entries = new Map<string, SourceEntry>();
  for (const entry of source) {
    if (entry.expiresAt != null && !Number.isFinite(entry.expiresAt))
      throw new MigrationError("Invalid source expiration.");
    if (expired(entry.expiresAt, now())) {
      expiredCount++;
      continue;
    }
    if (isRebuildableCache(entry.key)) {
      skippedCache++;
      continue;
    }
    const key = encodeMigrationKey(entry.key);
    if (key === readyBlobKey || entries.has(key))
      throw new MigrationError("Unexpected or duplicate source key.");
    canonicalize(entry.value);
    entries.set(key, entry);
  }
  await validateSource([...entries.values()]);
  const ready = await store.getWithMetadata(readyBlobKey, readOptions);
  if (ready != null && options.apply)
    throw new MigrationError(
      "Destination is already marked ready; do not recopy after cutover.",
    );

  // Complete preflight before any mutation. Ignore expired partial-copy blobs.
  for await (const page of store.list({ paginate: true })) {
    await forEachConcurrent(page.blobs, concurrency, async ({ key }) => {
      if (key === readyBlobKey) return;
      const target = await store.getWithMetadata(key, readOptions);
      if (target == null || blobAbsent(target, now())) return;
      const entry = entries.get(key);
      if (entry == null || !matches(entry, target))
        throw new MigrationError(
          "Destination contains conflicting live data; no writes performed.",
        );
    });
  }
  // Also read each source key directly: do not rely only on listing consistency.
  const selected = [...entries];
  let unchanged = 0;
  await forEachConcurrent(selected, concurrency, async ([key, entry]) => {
    const target = await store.getWithMetadata(key, readOptions);
    if (
      target != null &&
      !blobAbsent(target, now()) &&
      !matches(entry, target)
    ) {
      throw new MigrationError(
        "Destination conflicts with source; no writes performed.",
      );
    }
    if (target != null && matches(entry, target)) unchanged++;
  });

  const result = {
    copied: 0,
    unchanged: options.apply ? 0 : unchanged,
    expired: expiredCount,
    ready: ready != null,
    skippedCache,
    selected: entries.size,
  };
  // The preflight already inspected every selected key; dry runs stop here.
  if (!options.apply) return result;
  await forEachConcurrent(selected, concurrency, async ([key, entry]) => {
    if (expired(entry.expiresAt, now())) {
      result.expired++;
      return;
    }
    const target = await store.getWithMetadata(key, readOptions);
    if (target != null && matches(entry, target)) {
      result.unchanged++;
      return;
    }
    if (target != null && !blobAbsent(target, now()))
      throw new MigrationError("Destination changed during migration.");
    if (target != null && !target.etag)
      throw new MigrationError("Destination did not return an ETag.");
    const written = await store.setJSON(key, entry.value, {
      metadata: { expireIn: entry.expiresAt },
      ...(target == null ? { onlyIfNew: true } : { onlyIfMatch: target.etag! }),
    });
    if (!written.modified)
      throw new MigrationError(
        "Conditional migration write failed; keep maintenance active and retry.",
      );
    result.copied++;
  });
  await forEachConcurrent(selected, concurrency, async ([key, entry]) => {
    if (expired(entry.expiresAt, now())) return;
    const target = await store.getWithMetadata(key, readOptions);
    if (target == null || !matches(entry, target))
      throw new MigrationError(
        "Migration verification failed; readiness marker not written.",
      );
  });
  const marked = await store.setJSON(
    readyBlobKey,
    { version: 1, origin: options.origin },
    {
      metadata: { expireIn: null },
      onlyIfNew: true,
    },
  );
  if (!marked.modified)
    throw new MigrationError("Readiness marker changed during migration.");
  return { ...result, ready: true };
}
