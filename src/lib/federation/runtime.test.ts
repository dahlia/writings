import { MemoryKvStore } from "@fedify/fedify";
import { describe, expect, test } from "vitest";
import {
  assertBlobsReady,
  selectFederationServices,
  storageReadyKey,
} from "./storage";

describe("federation storage selection", () => {
  test("keeps legacy production until explicitly switched", () => {
    expect(selectFederationServices("production", true)).toBe("postgres");
    expect(selectFederationServices("production", false)).toBe("disabled");
    expect(selectFederationServices("production", false, "blobs")).toBe(
      "blobs",
    );
  });
  test("disables all non-production deployments even with Blobs selected", () => {
    for (const context of [
      "deploy-preview",
      "branch-deploy",
      "preview-server",
      "unknown",
    ]) {
      expect(selectFederationServices(context, true, "blobs", true)).toBe(
        "disabled",
      );
    }
  });
  test("only explicit Astro development permits memory", () => {
    expect(selectFederationServices(undefined, true)).toBe("disabled");
    expect(selectFederationServices(undefined, false, undefined, true)).toBe(
      "memory",
    );
    expect(selectFederationServices("dev", false)).toBe("blobs");
    expect(selectFederationServices("dev", true, "postgres")).toBe("postgres");
  });
  test("rejects typos rather than selecting another backend", () => {
    expect(() =>
      selectFederationServices("production", true, "blob"),
    ).toThrow();
  });
  test("requires an origin-bound migration marker and can retry after it appears", async () => {
    const kv = new MemoryKvStore();
    await expect(assertBlobsReady(kv, "https://example.com")).rejects.toThrow(
      "not ready",
    );
    await kv.set(storageReadyKey, {
      version: 1,
      origin: "https://other.example",
    });
    await expect(assertBlobsReady(kv, "https://example.com")).rejects.toThrow(
      "not ready",
    );
    await kv.set(storageReadyKey, {
      version: 1,
      origin: "https://example.com",
    });
    await expect(
      assertBlobsReady(kv, "https://example.com"),
    ).resolves.toBeUndefined();
  });
});
