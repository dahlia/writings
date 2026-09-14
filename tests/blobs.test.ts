import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { getStore } from "@netlify/blobs";
import { BlobsServer } from "@netlify/blobs/server";
import { NetlifyBlobsKvStore } from "@fedify/netlify";
import { describe, expect, test } from "vitest";
import { encodeMigrationKey } from "../scripts/federation-migration";

const cliRequire = createRequire(
  import.meta.resolve("netlify-cli/package.json"),
);
const devRequire = createRequire(cliRequire.resolve("@netlify/dev"));
const devServer = devRequire("@netlify/blobs/server") as {
  BlobsServer: typeof BlobsServer;
};

describe.each([
  ["direct SDK", BlobsServer],
  ["Netlify Dev's SDK", devServer.BlobsServer],
] as const)("%s local server", (_name, Server) => {
  test("supports the real adapter, ETags, conditional writes, expiry and tombstones", async () => {
    const directory = await mkdtemp(join(tmpdir(), "writings-blobs-"));
    const server = new Server({ directory, port: 0 });
    try {
      const { port } = await server.start();
      const store = getStore({
        name: "test",
        siteID: "test-site",
        token: "test-token",
        apiURL: `http://localhost:${port}`,
        consistency: "strong",
      });
      const kv = new NetlifyBlobsKvStore(store);
      const key = ["test", "한글/#?", ""] as const;
      expect(await kv.get(key)).toBeUndefined();
      expect(await kv.cas(key, undefined, { n: 0 })).toBe(true);
      const raw = await store.getWithMetadata(encodeMigrationKey(key), {
        type: "json",
      });
      expect(raw?.data).toEqual({ n: 0 });
      expect(raw?.etag).toBeTruthy();
      expect((await store.getMetadata(encodeMigrationKey(key)))?.etag).toBe(
        raw?.etag,
      );
      // The local SDK server does not serialize concurrent conditional PUTs.
      // Test stale-write rejection without claiming production atomicity here.
      expect(await kv.cas(key, { n: 0 }, { n: 1 })).toBe(true);
      expect(await kv.cas(key, { n: 0 }, { n: 2 })).toBe(false);
      expect(
        (
          await store.setJSON(encodeMigrationKey(key), "stale", {
            onlyIfMatch: raw!.etag!,
          })
        ).modified,
      ).toBe(false);
      const value = await kv.get(key);
      expect(await kv.cas(key, value, undefined)).toBe(true);
      expect(await kv.get(key)).toBeUndefined();
      expect(await kv.cas(key, undefined, "revived")).toBe(true);
      await store.setJSON(encodeMigrationKey(key), "expired", {
        metadata: { expireIn: Date.now() - 1 },
      });
      expect(await kv.get(key)).toBeUndefined();
      expect(await kv.cas(key, undefined, "after expiry")).toBe(true);
      expect(await new NetlifyBlobsKvStore(store).get(key)).toBe(
        "after expiry",
      );
    } finally {
      await server.stop();
      await rm(directory, { recursive: true, force: true });
    }
  });
});
