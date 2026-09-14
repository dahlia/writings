import { MemoryKvStore } from "@fedify/fedify";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { storageReadyKey } from "./storage";

const mocks = vi.hoisted(() => ({
  getStore: vi.fn(),
  database: vi.fn(),
  queue: vi.fn(),
}));
vi.mock("@netlify/functions", () => ({
  getContext() {
    throw new Error("no request context");
  },
}));
vi.mock("@netlify/blobs", () => ({ getStore: mocks.getStore }));
vi.mock("@netlify/async-workloads", () => ({ AsyncWorkloadsClient: class {} }));
vi.mock("@netlify/database", () => ({
  getConnectionString: mocks.database,
  MissingDatabaseConnectionError: class extends Error {},
}));
vi.mock("@fedify/netlify", () => ({
  NetlifyBlobsKvStore: class {
    constructor(store: object) {
      return store;
    }
  },
  NetlifyMessageQueue: class {
    constructor(options: unknown) {
      mocks.queue(options);
    }
  },
}));

import { createNetlifyServices } from "./services";

describe("persistent service guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("CONTEXT", undefined);
    vi.stubEnv("FEDERATION_STORAGE", "blobs");
  });
  afterEach(() => vi.unstubAllEnvs());
  test("unknown and preview contexts fail without touching storage", async () => {
    for (const context of [undefined, "deploy-preview", "branch-deploy"]) {
      vi.stubEnv("CONTEXT", context);
      await expect(
        createNetlifyServices({ origin: "https://example.com" }),
      ).rejects.toThrow("unavailable");
    }
    expect(mocks.getStore).not.toHaveBeenCalled();
    expect(mocks.database).not.toHaveBeenCalled();
  });
  test("production checks readiness before creating a queue and retries missing markers", async () => {
    vi.stubEnv("CONTEXT", "production");
    const kv = new MemoryKvStore();
    mocks.getStore.mockReturnValue(kv);
    await expect(
      createNetlifyServices({ origin: "https://example.com" }),
    ).rejects.toThrow("not ready");
    expect(mocks.queue).not.toHaveBeenCalled();
    await kv.set(storageReadyKey, {
      version: 1,
      origin: "https://example.com",
    });
    const services = await createNetlifyServices({
      origin: "https://example.com",
    });
    expect(services.kv).toBe(kv);
    expect(mocks.getStore).toHaveBeenCalledWith({
      name: "fedify",
      consistency: "strong",
    });
    expect(mocks.queue).toHaveBeenCalledWith(
      expect.objectContaining({ orderingKv: kv, eventName: "fedify:queue" }),
    );
    expect(mocks.database).not.toHaveBeenCalled();
  });
  test("Netlify Dev allows an isolated empty store without a database", async () => {
    vi.stubEnv("CONTEXT", "dev");
    vi.stubEnv("FEDERATION_STORAGE", undefined);
    mocks.getStore.mockReturnValue(new MemoryKvStore());
    await expect(
      createNetlifyServices({ origin: "http://localhost:8888" }),
    ).resolves.toBeDefined();
    expect(mocks.database).not.toHaveBeenCalled();
  });
});
