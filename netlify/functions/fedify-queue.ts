import type { AsyncWorkloadConfig } from "@netlify/async-workloads";
import {
  createNetlifyQueueHandler,
  type NetlifyQueueEvent,
} from "@fedify/netlify";
import {
  builder,
  type FederationContextData,
} from "../../src/lib/federation/builder";
import {
  federationOrigin,
  syncMaxRetries,
} from "../../src/lib/federation/config";
import { createNetlifyServices } from "../../src/lib/federation/services";
import { queueEventName } from "../../src/lib/federation/storage";

async function createHandler() {
  const { kv, queue } = await createNetlifyServices({
    baseUrl: federationOrigin,
    origin: federationOrigin,
  });
  const contextData: FederationContextData = {
    kv,
    getPosts: async () => [],
  };

  return createNetlifyQueueHandler<FederationContextData>({
    queue,
    maxRetries: syncMaxRetries,
    federation: () =>
      builder.build({
        kv,
        queue,
        manuallyStartQueue: true,
        origin: federationOrigin,
      }),
    contextData: (event) => {
      const deployId = event.request.headers.get("x-nf-deploy-id");
      return {
        ...contextData,
        ...(deployId == null ? {} : { deployId }),
      };
    },
  });
}

export default async (
  ...args: Parameters<Awaited<ReturnType<typeof createHandler>>>
) => {
  const handler = await createHandler();
  return handler(...args);
};

export const asyncWorkloadConfig: AsyncWorkloadConfig<NetlifyQueueEvent> = {
  events: [queueEventName],
  maxRetries: syncMaxRetries,
  backoffSchedule: (attempt) => 5_000 * 2 ** attempt,
  ...(process.env.CONTEXT === "production" || process.env.CONTEXT === "dev"
    ? {}
    : { status: "disabled" }),
};
