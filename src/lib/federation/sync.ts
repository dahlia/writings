import type { Context, KvKey, KvStore } from "@fedify/fedify";
import type { DocumentLoader } from "@fedify/vocab-runtime";
import {
  Article,
  Collection,
  Create,
  Delete,
  PUBLIC_COLLECTION,
  Update,
} from "@fedify/vocab";
import serialize from "json-canon";
import { Temporal } from "temporal-polyfill";
import {
  actorIdentifier,
  federationKvPrefix,
  publicationSyncLockTtlMs,
} from "./config";

export interface CurrentArticle {
  readonly id: string;
  readonly hash: string;
  readonly create: Create;
  readonly article: Article;
}

export interface StoredArticle {
  readonly id: string;
  readonly hash: string;
  readonly present?: boolean;
  readonly generation?: number;
  readonly revision?: number;
}

export type ReconciliationAction =
  | {
      readonly type: "create";
      readonly current: CurrentArticle;
      readonly generation: number;
      readonly revision: number;
    }
  | {
      readonly type: "update";
      readonly current: CurrentArticle;
      readonly previous: StoredArticle;
      readonly revision: number;
    }
  | {
      readonly type: "delete";
      readonly previous: StoredArticle;
      readonly revision: number;
    };

export interface ReconciliationDeployment {
  readonly deployId: string;
  readonly publishedAt: string;
}

export function createDeployDocumentLoader(
  loader: DocumentLoader,
  canonicalOrigin: URL,
  deployOrigin: URL,
): DocumentLoader {
  return async (url, options) => {
    const requestedUrl = new URL(url);
    if (requestedUrl.origin !== canonicalOrigin.origin) {
      return loader(url, options);
    }
    const deployedUrl = new URL(
      `${requestedUrl.pathname}${requestedUrl.search}${requestedUrl.hash}`,
      deployOrigin,
    );
    const document = await loader(deployedUrl.href, options);
    return { ...document, documentUrl: requestedUrl.href };
  };
}

const initializedKey = [...federationKvPrefix, "sync", "initialized"] as KvKey;
const lockKey = [...federationKvPrefix, "sync", "lock"] as KvKey;
const postsPrefix = [...federationKvPrefix, "sync", "posts"] as KvKey;
const lastDeploymentKey = [
  ...federationKvPrefix,
  "sync",
  "last-deployment",
] as KvKey;

function postKey(id: string): KvKey {
  return [...postsPrefix, id];
}

export function planReconciliation(
  current: readonly CurrentArticle[],
  stored: readonly StoredArticle[],
): ReconciliationAction[] {
  const storedById = new Map(stored.map((article) => [article.id, article]));
  const currentIds = new Set(current.map((article) => article.id));
  const actions: ReconciliationAction[] = [];
  for (const article of current) {
    const previous = storedById.get(article.id);
    if (previous == null) {
      actions.push({
        type: "create",
        current: article,
        generation: 0,
        revision: 0,
      });
    } else if (previous.present === false) {
      actions.push({
        type: "create",
        current: article,
        generation: (previous.generation ?? 0) + 1,
        revision: (previous.revision ?? 0) + 1,
      });
    } else if (previous.hash !== article.hash) {
      actions.push({
        type: "update",
        current: article,
        previous,
        revision: (previous.revision ?? 0) + 1,
      });
    }
  }
  for (const previous of stored) {
    if (previous.present !== false && !currentIds.has(previous.id))
      actions.push({
        type: "delete",
        previous,
        revision: (previous.revision ?? 0) + 1,
      });
  }
  return actions;
}

export function isDeploymentNewer(
  candidate: ReconciliationDeployment,
  baseline: ReconciliationDeployment,
): boolean {
  if (candidate.deployId === baseline.deployId) return false;
  return (
    Temporal.Instant.compare(
      Temporal.Instant.from(candidate.publishedAt),
      Temporal.Instant.from(baseline.publishedAt),
    ) > 0
  );
}

export function createPublicationActivityId(
  articleId: string,
  type: ReconciliationAction["type"],
  generation: number,
  revision: number,
  hash: string,
): URL {
  return new URL(`#${type}-${generation}-${revision}-${hash}`, articleId);
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function collectCurrentArticles(
  context: Context<unknown>,
  outboxUri: URL = context.getOutboxUri(actorIdentifier),
): Promise<CurrentArticle[]> {
  const articles: CurrentArticle[] = [];
  const outbox = await context.lookupObject(outboxUri);
  if (!(outbox instanceof Collection)) {
    throw new Error("The actor outbox could not be loaded.");
  }
  for await (const item of context.traverseCollection(outbox)) {
    if (!(item instanceof Create)) continue;
    const object = await item.getObject(context);
    if (!(object instanceof Article) || object.id == null) continue;
    articles.push({
      id: object.id.href,
      hash: await sha256(serialize(await object.toJsonLd())),
      create: item,
      article: object,
    });
  }
  return articles;
}

async function getStoredArticles(kv: KvStore): Promise<StoredArticle[]> {
  const stored: StoredArticle[] = [];
  for await (const { value } of kv.list(postsPrefix)) {
    stored.push(value as StoredArticle);
  }
  return stored;
}

export interface DurableSteps {
  run<T>(stepId: string, callback: () => T | Promise<T>): Promise<T>;
}

export interface ReconciliationSource {
  readonly context: Context<unknown>;
  readonly outboxUri: URL;
  readonly deployment?: ReconciliationDeployment;
}

export async function reconcileArticles(
  context: Context<unknown>,
  kv: KvStore,
  steps: DurableSteps,
  source: ReconciliationSource = {
    context,
    outboxUri: context.getOutboxUri(actorIdentifier),
  },
): Promise<void> {
  if (kv.cas == null) throw new Error("Publication sync requires CAS support.");
  const token = crypto.randomUUID();
  if (
    !(await kv.cas(lockKey, undefined, token, {
      ttl: Temporal.Duration.from({ milliseconds: publicationSyncLockTtlMs }),
    }))
  ) {
    throw new Error("Another publication sync is still running.");
  }

  try {
    const lastDeployment = (await kv.get(lastDeploymentKey)) as
      ReconciliationDeployment | undefined;
    if (
      source.deployment != null &&
      lastDeployment != null &&
      !isDeploymentNewer(source.deployment, lastDeployment)
    ) {
      return;
    }

    const current = await collectCurrentArticles(
      source.context,
      source.outboxUri,
    );
    if ((await kv.get(initializedKey)) == null) {
      for (const article of current) {
        await steps.run(`seed:${article.hash}`, () =>
          kv.set(postKey(article.id), {
            id: article.id,
            hash: article.hash,
            present: true,
            generation: 0,
            revision: 0,
          }),
        );
      }
      await steps.run("seed:complete", () => kv.set(initializedKey, true));
    } else {
      const actions = planReconciliation(current, await getStoredArticles(kv));
      const actor = context.getActorUri(actorIdentifier);
      const followers = context.getFollowersUri(actorIdentifier);
      for (const action of actions) {
        const id =
          action.type === "delete" ? action.previous.id : action.current.id;
        const hash =
          action.type === "delete" ? action.previous.hash : action.current.hash;
        const generation =
          action.type === "create"
            ? action.generation
            : (action.previous.generation ?? 0);
        const revision = action.revision;
        await steps.run(
          `deliver:${action.type}:${generation}:${revision}:${hash}`,
          async () => {
            const activity =
              action.type === "create"
                ? action.current.create.clone({
                    id: createPublicationActivityId(
                      id,
                      action.type,
                      generation,
                      revision,
                      hash,
                    ),
                  })
                : action.type === "update"
                  ? new Update({
                      id: createPublicationActivityId(
                        id,
                        action.type,
                        generation,
                        revision,
                        hash,
                      ),
                      actor,
                      object: action.current.article,
                      to: PUBLIC_COLLECTION,
                      cc: followers,
                    })
                  : new Delete({
                      id: createPublicationActivityId(
                        id,
                        action.type,
                        generation,
                        revision,
                        hash,
                      ),
                      actor,
                      object: new URL(id),
                      to: PUBLIC_COLLECTION,
                      cc: followers,
                    });
            await context.sendActivity(
              { identifier: actorIdentifier },
              "followers",
              activity,
              { preferSharedInbox: true, orderingKey: id },
            );
          },
        );
        await steps.run(
          `store:${action.type}:${generation}:${revision}:${hash}`,
          () =>
            kv.set(postKey(id), {
              id,
              hash,
              present: action.type !== "delete",
              generation,
              revision,
            }),
        );
      }
    }
    if (source.deployment != null) {
      await steps.run(`deploy:${source.deployment.deployId}`, () =>
        kv.set(lastDeploymentKey, source.deployment),
      );
    }
  } finally {
    await kv.cas(lockKey, token, undefined);
  }
}
