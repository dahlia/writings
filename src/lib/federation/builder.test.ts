import { MemoryKvStore } from "@fedify/fedify";
import { describe, expect, test } from "vitest";
import { builder, type FederationContextData } from "./builder";
import { federationOrigin } from "./config";
import { groupFederatedPosts, type PostEntryData } from "./model";

const posts = groupFederatedPosts([
  {
    year: "2026",
    month: "07",
    slug: "hello",
    route: "/2026/07/hello/",
    published: "2026-07-01T00:00:00.000Z",
    updated: "2026-07-02T00:00:00.000Z",
    language: "en",
    title: "Hello",
    description: "A greeting",
    html: "<h1>Hello</h1>",
  } satisfies PostEntryData,
]);

async function createTestFederation() {
  const kv = new MemoryKvStore();
  const contextData: FederationContextData = {
    kv,
    getPosts: async () => posts,
  };
  return {
    contextData,
    federation: await builder.build({ kv, origin: federationOrigin }),
  };
}

describe("federation endpoints", () => {
  test("WebFinger resolves the handle to the /ap/ actor", async () => {
    const { federation, contextData } = await createTestFederation();
    const response = await federation.fetch(
      new Request(
        `${federationOrigin}/.well-known/webfinger?resource=${encodeURIComponent("acct:hongminhee@writings.hongminhee.org")}`,
      ),
      { contextData },
    );
    expect(response.status).toBe(200);
    const json = (await response.json()) as {
      subject: string;
      links: { rel: string; href: string }[];
    };
    expect(json.subject).toBe("acct:hongminhee@writings.hongminhee.org");
    expect(json.links).toContainEqual(
      expect.objectContaining({
        rel: "self",
        href: `${federationOrigin}/ap/actors/hongminhee`,
      }),
    );
  });

  test("serves the Person and multilingual Article under /ap/", async () => {
    const { federation, contextData } = await createTestFederation();
    const headers = { Accept: "application/activity+json" };
    const actorResponse = await federation.fetch(
      new Request(`${federationOrigin}/ap/actors/hongminhee`, { headers }),
      { contextData },
    );
    expect(actorResponse.status).toBe(200);
    expect(await actorResponse.json()).toEqual(
      expect.objectContaining({
        id: `${federationOrigin}/ap/actors/hongminhee`,
        type: "Person",
        preferredUsername: "hongminhee",
        name: "洪民憙 (Hong Minhee)",
        nameMap: {
          en: "Hong Minhee",
          "ko-hang-kr": "홍민희",
          "ko-kore": "洪民憙",
          ja: "洪民憙",
        },
        summary: "洪民憙雜記 (Hong Minhee on Things)",
        summaryMap: {
          en: "Hong Minhee on Things",
          "ko-hang-kr": "洪民憙雜記",
          "ko-kore": "洪民憙雜記",
          ja: "洪民憙雑記",
        },
        inbox: `${federationOrigin}/ap/actors/hongminhee/inbox`,
        outbox: `${federationOrigin}/ap/actors/hongminhee/outbox`,
      }),
    );

    const articleResponse = await federation.fetch(
      new Request(`${federationOrigin}/ap/articles/2026/07/hello`, { headers }),
      { contextData },
    );
    expect(articleResponse.status).toBe(200);
    expect(await articleResponse.json()).toEqual(
      expect.objectContaining({
        id: `${federationOrigin}/ap/articles/2026/07/hello`,
        type: "Article",
        name: "Hello",
      }),
    );
  });

  test("exposes a paginated outbox", async () => {
    const { federation, contextData } = await createTestFederation();
    const headers = { Accept: "application/activity+json" };
    const collection = await federation.fetch(
      new Request(`${federationOrigin}/ap/actors/hongminhee/outbox`, {
        headers,
      }),
      { contextData },
    );
    const collectionJson = (await collection.json()) as { first: string };
    expect(collectionJson.first).toContain("cursor=");
    const page = await federation.fetch(
      new Request(collectionJson.first, { headers }),
      { contextData },
    );
    expect(await page.json()).toEqual(
      expect.objectContaining({
        type: "OrderedCollectionPage",
        orderedItems: [
          expect.objectContaining({
            id: `${federationOrigin}/ap/articles/2026/07/hello#create`,
          }),
        ],
      }),
    );
  });
});
