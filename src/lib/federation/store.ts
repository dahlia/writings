import {
  exportJwk,
  generateCryptoKeyPair,
  importJwk,
  type KvKey,
  type KvStore,
} from "@fedify/fedify";
import { Endpoints, type Recipient } from "@fedify/vocab";
import { actorIdentifier, federationKvPrefix } from "./config";

interface StoredKeyPair {
  readonly privateKey: JsonWebKey;
  readonly publicKey: JsonWebKey;
}

export interface StoredFollower {
  readonly id: string;
  readonly inboxId?: string;
  readonly sharedInboxId?: string;
}

const keyPairsKey = [...federationKvPrefix, "keys", actorIdentifier] as KvKey;
const followersPrefix = [...federationKvPrefix, "followers"] as KvKey;

function followerKey(id: URL): KvKey {
  return [...followersPrefix, id.href];
}

async function deserializeKeyPairs(
  stored: readonly StoredKeyPair[],
): Promise<CryptoKeyPair[]> {
  return Promise.all(
    stored.map(async (pair) => ({
      privateKey: await importJwk(pair.privateKey, "private"),
      publicKey: await importJwk(pair.publicKey, "public"),
    })),
  );
}

export async function getOrCreateActorKeyPairs(
  kv: KvStore,
): Promise<CryptoKeyPair[]> {
  const existing = await kv.get<StoredKeyPair[]>(keyPairsKey);
  if (existing != null) return deserializeKeyPairs(existing);

  const generated = await Promise.all([
    generateCryptoKeyPair("RSASSA-PKCS1-v1_5"),
    generateCryptoKeyPair("Ed25519"),
  ]);
  const serialized = await Promise.all(
    generated.map(async (pair) => ({
      privateKey: await exportJwk(pair.privateKey),
      publicKey: await exportJwk(pair.publicKey),
    })),
  );
  if (kv.cas == null) {
    await kv.set(keyPairsKey, serialized);
    return generated;
  }
  if (await kv.cas(keyPairsKey, undefined, serialized)) return generated;
  const winner = await kv.get<StoredKeyPair[]>(keyPairsKey);
  if (winner == null) throw new Error("Failed to persist the actor key pairs.");
  return deserializeKeyPairs(winner);
}

export async function saveFollower(
  kv: KvStore,
  follower: StoredFollower,
): Promise<void> {
  await kv.set(followerKey(new URL(follower.id)), follower);
}

export async function removeFollower(kv: KvStore, id: URL): Promise<void> {
  await kv.delete(followerKey(id));
}

export async function getFollowers(kv: KvStore): Promise<Recipient[]> {
  const stored: StoredFollower[] = [];
  for await (const { value } of kv.list(followersPrefix)) {
    stored.push(value as StoredFollower);
  }
  stored.sort((left, right) => left.id.localeCompare(right.id));
  return stored.map((follower) => ({
    id: new URL(follower.id),
    inboxId: follower.inboxId == null ? null : new URL(follower.inboxId),
    endpoints:
      follower.sharedInboxId == null
        ? null
        : new Endpoints({ sharedInbox: new URL(follower.sharedInboxId) }),
  }));
}
