import { fedifyMiddleware } from "@fedify/astro";
import { withFederationResponseCache } from "./lib/federation/cache";
import { createWebRuntime } from "./lib/federation/runtime";

const runtime = await createWebRuntime();
const federationMiddleware =
  runtime.enabled && runtime.federation != null && runtime.contextData != null
    ? fedifyMiddleware(runtime.federation, () => runtime.contextData!)
    : null;

export const onRequest = withFederationResponseCache(federationMiddleware);
