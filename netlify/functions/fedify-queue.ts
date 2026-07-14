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

const { kv, queue } = createNetlifyServices({ baseUrl: federationOrigin });
const contextData: FederationContextData = {
  kv,
  getPosts: async () => [],
};

export default createNetlifyQueueHandler<FederationContextData>({
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

export const asyncWorkloadConfig: AsyncWorkloadConfig<NetlifyQueueEvent> = {
  events: [queue.eventName],
  maxRetries: syncMaxRetries,
  backoffSchedule: (attempt) => 5_000 * 2 ** attempt,
  ...(process.env.CONTEXT === "production" || process.env.CONTEXT === "dev"
    ? {}
    : { status: "disabled" }),
};
