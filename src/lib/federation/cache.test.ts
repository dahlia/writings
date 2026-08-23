import type { MiddlewareHandler } from "astro";
import { describe, expect, test } from "vitest";
import { vi } from "vitest";
import {
  cachePublicFederationResponse,
  federationCacheControl,
  withFederationResponseCache,
} from "./cache";

function createContext(path: string, isPrerendered = false) {
  return {
    isPrerendered,
    request: new Request(`https://writings.hongminhee.org${path}`),
  } as Parameters<MiddlewareHandler>[0];
}

describe("cachePublicFederationResponse", () => {
  test.each([
    "/.well-known/webfinger?resource=acct%3Ahongminhee%40writings.hongminhee.org",
    "/ap/actors/hongminhee",
    "/ap/actors/hongminhee/outbox",
    "/ap/actors/hongminhee/outbox?cursor=10",
    "/ap/articles/2026/07/fedified-blog",
  ])("caches a successful public federation response at %s", async (path) => {
    const request = new Request(`https://writings.hongminhee.org${path}`);
    const response = new Response("body", {
      headers: {
        "Cache-Control": "no-cache",
        Vary: "Accept",
      },
    });

    const cached = cachePublicFederationResponse(request, response);

    expect(cached.headers.get("Netlify-CDN-Cache-Control")).toBe(
      federationCacheControl,
    );
    expect(cached.headers.get("Cache-Control")).toBe("no-cache");
    expect(cached.headers.get("Vary")).toBe("Accept");
    expect(cached.status).toBe(200);
    expect(await cached.text()).toBe("body");
  });

  test("caches HEAD responses without adding a body", async () => {
    const request = new Request(
      "https://writings.hongminhee.org/ap/actors/hongminhee",
      { method: "HEAD" },
    );
    const response = new Response(null);

    const cached = cachePublicFederationResponse(request, response);

    expect(cached.headers.get("Netlify-CDN-Cache-Control")).toBe(
      federationCacheControl,
    );
    expect(await cached.text()).toBe("");
  });

  test.each([
    ["POST", "/ap/actors/hongminhee/inbox", 202],
    ["GET", "/ap/inbox", 405],
    ["GET", "/ap/actors/hongminhee/followers", 200],
    ["GET", "/ap/actors/someone-else", 200],
    ["GET", "/ap/articles/2026/07/fedified-blog/extra", 200],
    ["GET", "/unrelated", 200],
    ["GET", "/ap/actors/hongminhee", 404],
  ])("does not cache %s %s with status %i", (method, path, status) => {
    const request = new Request(`https://writings.hongminhee.org${path}`, {
      method,
    });
    const response = new Response(null, { status });

    expect(cachePublicFederationResponse(request, response)).toBe(response);
    expect(response.headers.has("Netlify-CDN-Cache-Control")).toBe(false);
  });
});

describe("withFederationResponseCache", () => {
  test("caches responses returned by the federation middleware", async () => {
    const federationMiddleware: MiddlewareHandler = vi.fn(async () =>
      Promise.resolve(new Response("body")),
    );
    const next = vi.fn(async () => new Response("next"));

    const response = await withFederationResponseCache(federationMiddleware)(
      createContext("/ap/actors/hongminhee"),
      next,
    );

    expect(response?.headers.get("Netlify-CDN-Cache-Control")).toBe(
      federationCacheControl,
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("bypasses federation for prerendered requests", async () => {
    const federationMiddleware = vi.fn<MiddlewareHandler>();
    const nextResponse = new Response("next");
    const next = vi.fn(async () => nextResponse);

    const response = await withFederationResponseCache(federationMiddleware)(
      createContext("/index.html", true),
      next,
    );

    expect(response).toBe(nextResponse);
    expect(federationMiddleware).not.toHaveBeenCalled();
  });

  test("bypasses federation when it is disabled", async () => {
    const nextResponse = new Response("next");
    const next = vi.fn(async () => nextResponse);

    const response = await withFederationResponseCache(null)(
      createContext("/ap/actors/hongminhee"),
      next,
    );

    expect(response).toBe(nextResponse);
    expect(next).toHaveBeenCalledOnce();
  });

  test("rejects when federation returns no response", async () => {
    const federationMiddleware: MiddlewareHandler = () => undefined;

    const result = withFederationResponseCache(federationMiddleware)(
      createContext("/ap/actors/hongminhee"),
      vi.fn(async () => new Response("next")),
    );

    await expect(Promise.resolve(result)).rejects.toThrow(
      "The Fedify middleware returned no response.",
    );
  });
});
