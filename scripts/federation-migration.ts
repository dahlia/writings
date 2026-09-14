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
  },
): Promise<{
  copied: number;
  unchanged: number;
  expired: number;
  ready: boolean;
}> {
  if (options.apply && !options.quiesced)
    throw new MigrationError("Apply requires --quiesced.");
  const now = options.now ?? Date.now;
  const entries = new Map<string, SourceEntry>();
  for (const entry of source) {
    if (entry.expiresAt != null && !Number.isFinite(entry.expiresAt))
      throw new MigrationError("Invalid source expiration.");
    if (expired(entry.expiresAt, now())) continue;
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
    for (const { key } of page.blobs) {
      if (key === readyBlobKey) continue;
      const target = await store.getWithMetadata(key, readOptions);
      if (target == null || blobAbsent(target, now())) continue;
      const entry = entries.get(key);
      if (entry == null || !matches(entry, target))
        throw new MigrationError(
          "Destination contains conflicting live data; no writes performed.",
        );
    }
  }
  // Also read each source key directly: do not rely only on listing consistency.
  for (const [key, entry] of entries) {
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
  }

  const result = {
    copied: 0,
    unchanged: 0,
    expired: source.length - entries.size,
    ready: ready != null,
  };
  for (const [key, entry] of entries) {
    if (expired(entry.expiresAt, now())) {
      result.expired++;
      continue;
    }
    const target = await store.getWithMetadata(key, readOptions);
    if (target != null && matches(entry, target)) {
      result.unchanged++;
      continue;
    }
    if (target != null && !blobAbsent(target, now()))
      throw new MigrationError("Destination changed during migration.");
    if (!options.apply) continue;
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
  }
  if (!options.apply) return result;
  for (const [key, entry] of entries) {
    if (expired(entry.expiresAt, now())) continue;
    const target = await store.getWithMetadata(key, readOptions);
    if (target == null || !matches(entry, target))
      throw new MigrationError(
        "Migration verification failed; readiness marker not written.",
      );
  }
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
