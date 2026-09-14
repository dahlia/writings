import { fedifyMiddleware } from "@fedify/astro";
import { withFederationResponseCache } from "./lib/federation/cache";
import { createWebRuntime } from "./lib/federation/runtime";
import type { MiddlewareHandler } from "astro";
import { isFederationMaintenance } from "./lib/federation/storage";

async function createMiddleware() {
  const runtime = await createWebRuntime();
  return runtime.enabled &&
    runtime.federation != null &&
    runtime.contextData != null
    ? fedifyMiddleware(runtime.federation, () => runtime.contextData!)
    : null;
}

let middleware: ReturnType<typeof createMiddleware> | undefined;

export const onRequest: MiddlewareHandler = async (context, next) => {
  if (context.isPrerendered) return next();
  if (
    isFederationMaintenance() &&
    (context.url.pathname === "/.well-known/webfinger" ||
      context.url.pathname.startsWith("/ap/"))
  ) {
    return new Response(null, {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Netlify-CDN-Cache-Control": "no-store",
        "Retry-After": "300",
      },
    });
  }
  middleware ??= createMiddleware().catch((error) => {
    middleware = undefined;
    throw error;
  });
  const response = await withFederationResponseCache(await middleware)(
    context,
    next,
  );
  if (response == null)
    throw new TypeError("The Fedify middleware returned no response.");
  return response;
};
