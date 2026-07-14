import {
  asyncWorkloadFn,
  type AsyncWorkloadConfig,
  ErrorRetryAfterDelay,
  type CustomAsyncWorkloadEvent,
} from "@netlify/async-workloads";
import { createFederation, MemoryKvStore } from "@fedify/fedify";
import { getDocumentLoader } from "@fedify/vocab-runtime";
import { builder } from "../../src/lib/federation/builder";
import {
  actorIdentifier,
  federationOrigin,
  publicationSyncLockRetryDelayMs,
  syncEventName,
  syncMaxRetries,
} from "../../src/lib/federation/config";
import { createNetlifyServices } from "../../src/lib/federation/services";
import {
  createDeployDocumentLoader,
  reconcileArticles,
} from "../../src/lib/federation/sync";

interface SyncEvent extends CustomAsyncWorkloadEvent {
  eventName: typeof syncEventName;
  eventData: {
    readonly deployId?: string;
    readonly deployUrl?: string;
    readonly publishedAt?: string;
  };
}

export default asyncWorkloadFn<SyncEvent>(async (event) => {
  const deployId = event.eventData.deployId;
  const deployUrl = event.eventData.deployUrl;
  const publishedAt = event.eventData.publishedAt;
  if ((deployId == null) !== (publishedAt == null)) return;
  const { kv, queue } = createNetlifyServices({ baseUrl: federationOrigin });
  const contextData = {
    kv,
    getPosts: async () => {
      throw new Error(
        "Publication sync must load posts from the deployed outbox.",
      );
    },
    ...(deployId == null ? {} : { deployId }),
  };
  const federation = await builder.build({
    kv,
    queue,
    manuallyStartQueue: true,
    origin: federationOrigin,
  });
  const context = federation.createContext(
    new URL(federationOrigin),
    contextData,
  );
  const sourceFederation = createFederation<void>({
    kv: new MemoryKvStore(),
    ...(deployUrl == null
      ? {}
      : {
          documentLoaderFactory: (options) =>
            createDeployDocumentLoader(
              getDocumentLoader(options),
              new URL(federationOrigin),
              new URL(deployUrl),
            ),
        }),
  });
  const sourceContext = sourceFederation.createContext(
    new URL("https://publication-sync.invalid/"),
    undefined,
  );
  try {
    await reconcileArticles(context, kv, event.step, {
      context: sourceContext,
      outboxUri: context.getOutboxUri(actorIdentifier),
      ...(deployId == null || publishedAt == null
        ? {}
        : { deployment: { deployId, publishedAt } }),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Another publication sync is still running."
    ) {
      throw new ErrorRetryAfterDelay({
        message: error.message,
        error,
        retryDelay: publicationSyncLockRetryDelayMs,
      });
    }
    throw error;
  }
});

export const asyncWorkloadConfig: AsyncWorkloadConfig<SyncEvent> = {
  events: [syncEventName],
  maxRetries: syncMaxRetries,
  backoffSchedule: (attempt) => 5_000 * 2 ** attempt,
  ...(process.env.CONTEXT === "production" || process.env.CONTEXT === "dev"
    ? {}
    : { status: "disabled" }),
};
