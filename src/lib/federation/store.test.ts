import { MemoryKvStore } from "@fedify/fedify";
import { describe, expect, test } from "vitest";
import {
  getFollowers,
  getOrCreateActorKeyPairs,
  removeFollower,
  saveFollower,
} from "./store";

describe("federation store", () => {
  test("persists both actor key algorithms", async () => {
    const kv = new MemoryKvStore();
    const first = await getOrCreateActorKeyPairs(kv);
    const second = await getOrCreateActorKeyPairs(kv);
    expect(first.map((pair) => pair.privateKey.algorithm.name)).toEqual([
      "RSASSA-PKCS1-v1_5",
      "Ed25519",
    ]);
    const firstJwks = await Promise.all(
      first.map((pair) => crypto.subtle.exportKey("jwk", pair.publicKey)),
    );
    const secondJwks = await Promise.all(
      second.map((pair) => crypto.subtle.exportKey("jwk", pair.publicKey)),
    );
    expect(secondJwks).toEqual(firstJwks);
  });

  test("stores followers idempotently and reconstructs the shared inbox", async () => {
    const kv = new MemoryKvStore();
    const follower = {
      id: "https://remote.example/users/alice",
      inboxId: "https://remote.example/users/alice/inbox",
      sharedInboxId: "https://remote.example/inbox",
    };
    await saveFollower(kv, follower);
    await saveFollower(kv, follower);
    const recipients = await getFollowers(kv);
    expect(recipients).toHaveLength(1);
    expect(recipients[0]?.endpoints?.sharedInbox?.href).toBe(
      follower.sharedInboxId,
    );
    await removeFollower(kv, new URL(follower.id));
    expect(await getFollowers(kv)).toEqual([]);
  });
});
