import { Article, Create, OrderedCollection } from "@fedify/vocab";
import { MemoryKvStore, type Context } from "@fedify/fedify";
import { describe, expect, test, vi } from "vitest";
import {
  publicationSyncLockRetryDelayMs,
  publicationSyncLockTtlMs,
} from "./config";
import {
  collectCurrentArticles,
  createPublicationActivityId,
  createDeployDocumentLoader,
  isDeploymentNewer,
  planReconciliation,
  reconcileArticles,
  type CurrentArticle,
} from "./sync";

function current(id: string, hash: string): CurrentArticle {
  const article = new Article({ id: new URL(id) });
  return {
    id,
    hash,
    article,
    create: new Create({ id: new URL("#create", id), object: article }),
  };
}

describe("planReconciliation", () => {
  test("plans creates, updates, and deletes deterministically", () => {
    const actions = planReconciliation(
      [
        current("https://example.com/ap/articles/new", "new-hash"),
        current("https://example.com/ap/articles/changed", "new-version"),
        current("https://example.com/ap/articles/same", "same"),
      ],
      [
        { id: "https://example.com/ap/articles/changed", hash: "old-version" },
        { id: "https://example.com/ap/articles/same", hash: "same" },
        { id: "https://example.com/ap/articles/deleted", hash: "old-hash" },
      ],
    );
    expect(actions.map((action) => action.type)).toEqual([
      "create",
      "update",
      "delete",
    ]);
  });

  test("does nothing when the manifest has not changed", () => {
    const article = current("https://example.com/ap/articles/same", "same");
    expect(
      planReconciliation([article], [{ id: article.id, hash: article.hash }]),
    ).toEqual([]);
  });

  test("increments the publication generation when a deleted post returns", () => {
    const article = current("https://example.com/ap/articles/restored", "same");
    const [action] = planReconciliation(
      [article],
      [
        {
          id: article.id,
          hash: article.hash,
          present: false,
          generation: 2,
          revision: 4,
        },
      ],
    );

    expect(action).toMatchObject({
      type: "create",
      generation: 3,
      revision: 5,
    });
  });

  test("does not delete an article that is already recorded as absent", () => {
    expect(
      planReconciliation(
        [],
        [
          {
            id: "https://example.com/ap/articles/deleted",
            hash: "hash",
            present: false,
            generation: 1,
          },
        ],
      ),
    ).toEqual([]);
  });
});

test("publication activity IDs are retry-stable and revision-specific", () => {
  const articleId = "https://example.com/ap/articles/restored";

  expect(
    createPublicationActivityId(articleId, "create", 1, 7, "hash").href,
  ).toBe(`${articleId}#create-1-7-hash`);
  expect(
    createPublicationActivityId(articleId, "update", 1, 8, "hash").href,
  ).not.toBe(
    createPublicationActivityId(articleId, "update", 1, 7, "hash").href,
  );
  expect(
    createPublicationActivityId(articleId, "delete", 2, 9, "hash").href,
  ).toBe(`${articleId}#delete-2-9-hash`);
});

test("deployment ordering rejects older and duplicate deploys", () => {
  const older = { deployId: "a", publishedAt: "2026-07-14T00:00:00Z" };
  const newer = { deployId: "b", publishedAt: "2026-07-14T00:01:00Z" };

  expect(isDeploymentNewer(newer, older)).toBe(true);
  expect(isDeploymentNewer(older, newer)).toBe(false);
  expect(isDeploymentNewer(newer, newer)).toBe(false);
});

test("lock conflicts retry after an abandoned lock has expired", () => {
  expect(publicationSyncLockRetryDelayMs).toBeGreaterThan(
    publicationSyncLockTtlMs,
  );
});

test("reconcileArticles does not load an outbox older than its baseline", async () => {
  const kv = new MemoryKvStore();
  const article = new Article({
    id: new URL("https://publisher.example/ap/articles/post"),
  });
  const create = new Create({
    id: new URL("#create", article.id!),
    object: article,
  });
  const currentSource = {
    lookupObject: vi.fn().mockResolvedValue(new OrderedCollection({})),
    async *traverseCollection() {
      yield create;
    },
  } as unknown as Context<unknown>;
  const staleLookup = vi.fn();
  const staleSource = {
    lookupObject: staleLookup,
  } as unknown as Context<unknown>;
  const deliveryContext = {
    getActorUri: vi.fn(),
    getFollowersUri: vi.fn(),
    sendActivity: vi.fn(),
  } as unknown as Context<unknown>;
  const steps = {
    run: async <T>(_stepId: string, callback: () => T | Promise<T>) =>
      callback(),
  };
  const outboxUri = new URL(
    "https://publisher.example/ap/actors/author/outbox",
  );

  await reconcileArticles(deliveryContext, kv, steps, {
    context: currentSource,
    outboxUri,
    deployment: {
      deployId: "newer",
      publishedAt: "2026-07-14T00:01:00Z",
    },
  });
  await reconcileArticles(deliveryContext, kv, steps, {
    context: staleSource,
    outboxUri,
    deployment: {
      deployId: "older",
      publishedAt: "2026-07-14T00:00:00Z",
    },
  });

  expect(staleLookup).not.toHaveBeenCalled();
});

test("reconcileArticles assigns a fresh Create ID when a post returns", async () => {
  const kv = new MemoryKvStore();
  const article = new Article({
    id: new URL("https://publisher.example/ap/articles/restored"),
  });
  const originalCreate = new Create({
    id: new URL("#create", article.id!),
    object: article,
  });
  const source = (items: Create[]) =>
    ({
      lookupObject: vi.fn().mockResolvedValue(new OrderedCollection({})),
      async *traverseCollection() {
        yield* items;
      },
    }) as unknown as Context<unknown>;
  const sent: unknown[] = [];
  const deliveryContext = {
    getActorUri: () => new URL("https://publisher.example/ap/actors/author"),
    getFollowersUri: () =>
      new URL("https://publisher.example/ap/actors/author/followers"),
    sendActivity: vi.fn(
      async (_sender: unknown, _recipients: unknown, activity: unknown) => {
        sent.push(activity);
      },
    ),
  } as unknown as Context<unknown>;
  const steps = {
    run: async <T>(_stepId: string, callback: () => T | Promise<T>) =>
      callback(),
  };
  const outboxUri = new URL(
    "https://publisher.example/ap/actors/author/outbox",
  );

  await reconcileArticles(deliveryContext, kv, steps, {
    context: source([originalCreate]),
    outboxUri,
  });
  await reconcileArticles(deliveryContext, kv, steps, {
    context: source([]),
    outboxUri,
  });
  await reconcileArticles(deliveryContext, kv, steps, {
    context: source([originalCreate]),
    outboxUri,
  });

  const restoredCreate = sent[1];
  expect(restoredCreate).toBeInstanceOf(Create);
  expect((restoredCreate as Create).id?.href).toMatch(
    `${article.id?.href}#create-1-2-`,
  );
  expect((restoredCreate as Create).id?.href).not.toBe(originalCreate.id?.href);
});

test("reconcileArticles assigns a new Update ID when content cycles", async () => {
  const kv = new MemoryKvStore();
  const articleId = new URL("https://publisher.example/ap/articles/cyclic");
  const activity = (name: string) =>
    new Create({
      id: new URL("#create", articleId),
      object: new Article({ id: articleId, name }),
    });
  const versionA = activity("A");
  const versionB = activity("B");
  const source = (item: Create) =>
    ({
      lookupObject: vi.fn().mockResolvedValue(new OrderedCollection({})),
      async *traverseCollection() {
        yield item;
      },
    }) as unknown as Context<unknown>;
  const sent: unknown[] = [];
  const deliveryContext = {
    getActorUri: () => new URL("https://publisher.example/ap/actors/author"),
    getFollowersUri: () =>
      new URL("https://publisher.example/ap/actors/author/followers"),
    sendActivity: vi.fn(
      async (_sender: unknown, _recipients: unknown, update: unknown) => {
        sent.push(update);
      },
    ),
  } as unknown as Context<unknown>;
  const steps = {
    run: async <T>(_stepId: string, callback: () => T | Promise<T>) =>
      callback(),
  };
  const outboxUri = new URL(
    "https://publisher.example/ap/actors/author/outbox",
  );

  for (const item of [versionA, versionB, versionA, versionB]) {
    await reconcileArticles(deliveryContext, kv, steps, {
      context: source(item),
      outboxUri,
    });
  }

  const firstVersionB = sent[0] as { id?: URL };
  const secondVersionB = sent[2] as { id?: URL };
  expect(firstVersionB.id?.href).toContain("#update-0-1-");
  expect(secondVersionB.id?.href).toContain("#update-0-3-");
  expect(secondVersionB.id?.href).not.toBe(firstVersionB.id?.href);
});

test("collectCurrentArticles reads the explicitly deployed outbox", async () => {
  const article = new Article({
    id: new URL("https://publisher.example/ap/articles/post"),
  });
  const create = new Create({
    id: new URL("https://publisher.example/ap/articles/post#create"),
    object: article,
  });
  const outbox = new OrderedCollection({});
  const outboxUri = new URL(
    "https://publisher.example/ap/actors/author/outbox",
  );
  const lookupObject = vi.fn().mockResolvedValue(outbox);
  const context = {
    lookupObject,
    async *traverseCollection() {
      yield create;
    },
  } as unknown as Context<unknown>;

  const articles = await collectCurrentArticles(context, outboxUri);

  expect(lookupObject).toHaveBeenCalledWith(outboxUri);
  expect(articles).toHaveLength(1);
  expect(articles[0]?.id).toBe(article.id?.href);
});

test("createDeployDocumentLoader pins every canonical request to one deploy", async () => {
  const loader = vi.fn(async (url: string) => ({
    contextUrl: null,
    document: { id: url },
    documentUrl: url,
  }));
  const deployedLoader = createDeployDocumentLoader(
    loader,
    new URL("https://publisher.example/"),
    new URL("https://deploy-id--publisher.netlify.app/"),
  );

  const document = await deployedLoader(
    "https://publisher.example/ap/actors/author/outbox?cursor=10",
  );

  expect(loader).toHaveBeenCalledWith(
    "https://deploy-id--publisher.netlify.app/ap/actors/author/outbox?cursor=10",
    undefined,
  );
  expect(document.documentUrl).toBe(
    "https://publisher.example/ap/actors/author/outbox?cursor=10",
  );
});

test("createDeployDocumentLoader leaves other origins unchanged", async () => {
  const loader = vi.fn(async (url: string) => ({
    contextUrl: null,
    document: { id: url },
    documentUrl: url,
  }));
  const deployedLoader = createDeployDocumentLoader(
    loader,
    new URL("https://publisher.example/"),
    new URL("https://deploy-id--publisher.netlify.app/"),
  );

  await deployedLoader("https://www.w3.org/ns/activitystreams");

  expect(loader).toHaveBeenCalledWith(
    "https://www.w3.org/ns/activitystreams",
    undefined,
  );
});
