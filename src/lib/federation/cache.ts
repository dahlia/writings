import type { MiddlewareHandler } from "astro";
import { actorIdentifier } from "./config";

export const federationCacheControl = "public, durable, max-age=86400";

const actorPath = `/ap/actors/${actorIdentifier}`;
const articlePathPattern = /^\/ap\/articles\/[^/]+\/[^/]+\/[^/]+$/;

function isPublicFederationResource(pathname: string): boolean {
  return (
    pathname === "/.well-known/webfinger" ||
    pathname === actorPath ||
    pathname === `${actorPath}/outbox` ||
    articlePathPattern.test(pathname)
  );
}

export function cachePublicFederationResponse(
  request: Request,
  response: Response,
): Response {
  if (
    (request.method !== "GET" && request.method !== "HEAD") ||
    response.status !== 200 ||
    !isPublicFederationResource(new URL(request.url).pathname)
  ) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("Netlify-CDN-Cache-Control", federationCacheControl);
  return new Response(request.method === "HEAD" ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function requireResponse(
  result: ReturnType<MiddlewareHandler>,
): Promise<Response> {
  const response = await result;
  if (response == null) {
    throw new TypeError("The Fedify middleware returned no response.");
  }
  return response;
}

export function withFederationResponseCache(
  middleware: MiddlewareHandler | null,
): MiddlewareHandler {
  return (context, next): Response | Promise<Response> => {
    if (context.isPrerendered || middleware == null) return next();
    return requireResponse(middleware(context, next)).then((response) =>
      cachePublicFederationResponse(context.request, response),
    );
  };
}
