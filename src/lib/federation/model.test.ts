import { createFederation, MemoryKvStore } from "@fedify/fedify";
import { Article } from "@fedify/vocab";
import { describe, expect, test } from "vitest";
import type { Language } from "../languages";
import {
  absolutizeLocalUrls,
  assertActivitySize,
  createArticle,
  getArticlePath,
  groupFederatedPosts,
  type PostEntryData,
} from "./model";
import { maxActivityBytes } from "./config";

function entry(language: Language, overrides: Partial<PostEntryData> = {}) {
  return {
    year: "2026",
    month: "07",
    slug: "hello",
    route: "/2026/07/hello/",
    published: "2026-07-01T00:00:00.000Z",
    updated: "2026-07-01T00:00:00.000Z",
    language,
    title: `${language} title`,
    description: `${language} description`,
    html: `<h1>${language}</h1><a href="/archive/">Archive</a>`,
    ...overrides,
  } satisfies PostEntryData;
}

describe("groupFederatedPosts", () => {
  test("groups translations into one post and prefers English", () => {
    const posts = groupFederatedPosts([
      entry("ko-Kore"),
      entry("ko-Hang-KR"),
      entry("en", { updated: "2026-07-02T00:00:00.000Z" }),
    ]);
    expect(posts).toHaveLength(1);
    expect(posts[0]?.defaultLanguage).toBe("en");
    expect(posts[0]?.updated).toBe("2026-07-02T00:00:00.000Z");
  });

  test("falls back to ko-Kore when English is unavailable", () => {
    const [post] = groupFederatedPosts([
      entry("ko-Hang-KR"),
      entry("ko-Kore"),
      entry("ja"),
    ]);
    expect(post?.defaultLanguage).toBe("ko-Kore");
  });
});

test("absolutizeLocalUrls resolves relative URLs against the canonical post", () => {
  expect(
    absolutizeLocalUrls(
      '<a href="/one">One</a><a href="isbn-123.md">Book</a><a href="#section">Section</a><img src="//cdn.example/a.png"><a href="https://example.com/">Two</a>',
      new URL("https://writings.hongminhee.org/2020/04/post/"),
    ),
  ).toBe(
    '<a href="https://writings.hongminhee.org/one">One</a><a href="https://writings.hongminhee.org/2020/04/post/isbn-123.md">Book</a><a href="https://writings.hongminhee.org/2020/04/post/#section">Section</a><img src="https://cdn.example/a.png"><a href="https://example.com/">Two</a>',
  );
});

test("createArticle emits a fallback plus multilingual maps and links", async () => {
  const federation = createFederation<void>({ kv: new MemoryKvStore() });
  federation.setActorDispatcher("/ap/actors/{identifier}", () => null);
  federation.setFollowersDispatcher(
    "/ap/actors/{identifier}/followers",
    () => ({ items: [] }),
  );
  federation.setObjectDispatcher(
    Article,
    "/ap/articles/{year}/{month}/{slug}",
    () => null,
  );
  const context = federation.createContext(
    new URL("https://example.com/"),
    undefined,
  );
  const [post] = groupFederatedPosts([entry("ko-Kore"), entry("en")]);
  const article = createArticle(context, post!);
  const json = (await article.toJsonLd()) as Record<string, unknown>;

  expect(article.id?.pathname).toBe(getArticlePath(post!));
  expect(json.name).toBe("en title");
  expect(json.nameMap).toEqual({ en: "en title", "ko-kore": "ko-Kore title" });
  expect(json.content).toContain("https://writings.hongminhee.org/archive/");
  expect(json.contentMap).toMatchObject({
    en: expect.stringContaining("en"),
    "ko-kore": expect.stringContaining("ko-Kore"),
  });
  expect(json.url).toEqual(
    expect.arrayContaining([
      "https://writings.hongminhee.org/2026/07/hello/",
      expect.objectContaining({
        href: "https://writings.hongminhee.org/2026/07/hello/index.en.html",
        hreflang: "en",
      }),
    ]),
  );
});

test("activity size validation measures the serialized multilingual activity", async () => {
  const federation = createFederation<void>({ kv: new MemoryKvStore() });
  federation.setActorDispatcher("/ap/actors/{identifier}", () => null);
  federation.setFollowersDispatcher(
    "/ap/actors/{identifier}/followers",
    () => ({ items: [] }),
  );
  federation.setObjectDispatcher(
    Article,
    "/ap/articles/{year}/{month}/{slug}",
    () => null,
  );
  const context = federation.createContext(
    new URL("https://example.com/"),
    undefined,
  );
  const html = "x".repeat(Math.floor(maxActivityBytes / 2) + 1_000);
  const [post] = groupFederatedPosts([entry("en", { html })]);

  expect(new TextEncoder().encode(html).byteLength).toBeLessThan(
    maxActivityBytes,
  );
  await expect(assertActivitySize(context, post!)).rejects.toThrow(
    /ActivityPub activity/,
  );
});
