import type { MiddlewareHandler } from "astro";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({ runtime: vi.fn(), federation: vi.fn() }));
vi.mock("./lib/federation/runtime", () => ({
  createWebRuntime: mocks.runtime,
}));
vi.mock("@fedify/astro", () => ({ fedifyMiddleware: () => mocks.federation }));
import { onRequest } from "./middleware";

function context(path: string, prerendered = false) {
  const url = new URL(path, "https://example.com");
  return {
    url,
    request: new Request(url),
    isPrerendered: prerendered,
  } as Parameters<MiddlewareHandler>[0];
}
beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.unstubAllEnvs());

test("prerendering and maintenance do not initialize storage", async () => {
  const next = vi.fn(async () => new Response("static"));
  await onRequest(context("/", true), next);
  vi.stubEnv("FEDERATION_MAINTENANCE", "true");
  for (const path of ["/ap/inbox", "/.well-known/webfinger"]) {
    const response = await onRequest(context(path), next);
    expect(response?.status).toBe(503);
    expect(response?.headers.get("Netlify-CDN-Cache-Control")).toBe("no-store");
  }
  expect(mocks.runtime).not.toHaveBeenCalled();
});

test("readiness errors are not negatively cached", async () => {
  const next = async () => new Response("fallback");
  mocks.runtime.mockRejectedValueOnce(new Error("not ready"));
  await expect(onRequest(context("/ap/inbox"), next)).rejects.toThrow(
    "not ready",
  );
  mocks.runtime.mockResolvedValue({
    enabled: true,
    federation: {},
    contextData: {},
  });
  mocks.federation.mockResolvedValue(new Response("actor"));
  const response = await onRequest(context("/ap/actors/hongminhee"), next);
  expect(response?.headers.get("Netlify-CDN-Cache-Control")).toContain(
    "durable",
  );
  expect(mocks.runtime).toHaveBeenCalledTimes(2);
});
