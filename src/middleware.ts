import { fedifyMiddleware } from "@fedify/astro";
import type { MiddlewareHandler } from "astro";
import { createWebRuntime } from "./lib/federation/runtime";

const runtime = await createWebRuntime();
const federationMiddleware =
  runtime.enabled && runtime.federation != null && runtime.contextData != null
    ? fedifyMiddleware(runtime.federation, () => runtime.contextData!)
    : null;

export const onRequest: MiddlewareHandler = (context, next) => {
  if (context.isPrerendered || federationMiddleware == null) return next();
  return federationMiddleware(context, next);
};
