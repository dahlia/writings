import { createFederation, MemoryKvStore, type Context } from "@fedify/fedify";
import { Article, Create, Link, PUBLIC_COLLECTION } from "@fedify/vocab";
import { LanguageString } from "@fedify/vocab-runtime";
import { Temporal } from "temporal-polyfill";
import { languageFiles, languages, type Language } from "../languages";
import { siteUrl } from "../site";
import { actorIdentifier, federationOrigin, maxActivityBytes } from "./config";

export interface FederatedPostVariant {
  readonly language: Language;
  readonly title: string;
  readonly description: string;
  readonly html: string;
  readonly updated: string;
}

export interface FederatedPost {
  readonly year: string;
  readonly month: string;
  readonly slug: string;
  readonly route: string;
  readonly published: string;
  readonly updated: string;
  readonly defaultLanguage: Language;
  readonly variants: readonly FederatedPostVariant[];
}

export interface PostEntryData extends FederatedPostVariant {
  readonly year: string;
  readonly month: string;
  readonly slug: string;
  readonly route: string;
  readonly published: string;
}

export function groupFederatedPosts(
  entries: readonly PostEntryData[],
): FederatedPost[] {
  const groups = Map.groupBy(entries, (entry) => entry.route);
  return [...groups.values()]
    .map((group) => {
      const first = group[0]!;
      const variants = group
        .map(({ language, title, description, html, updated }) => ({
          language,
          title,
          description,
          html,
          updated,
        }))
        .sort(
          (left, right) =>
            languages.indexOf(left.language) -
            languages.indexOf(right.language),
        );
      const defaultLanguage = variants.some(
        (variant) => variant.language === "en",
      )
        ? "en"
        : "ko-Kore";
      const updated = variants.reduce(
        (latest, variant) =>
          new Date(variant.updated).getTime() > new Date(latest).getTime()
            ? variant.updated
            : latest,
        first.updated,
      );
      return {
        year: first.year,
        month: first.month,
        slug: first.slug,
        route: first.route,
        published: first.published,
        updated,
        defaultLanguage,
        variants,
      } satisfies FederatedPost;
    })
    .sort(
      (left, right) =>
        new Date(right.published).getTime() -
        new Date(left.published).getTime(),
    );
}

export function absolutizeLocalUrls(html: string, baseUrl: URL): string {
  return html.replace(
    /(\s(?:href|src)=["'])([^"']+)(["'])/gi,
    (_match, before: string, reference: string, after: string) =>
      `${before}${new URL(reference, baseUrl).href}${after}`,
  );
}

export function getArticlePath(
  post: Pick<FederatedPost, "year" | "month" | "slug">,
) {
  return `/ap/articles/${post.year}/${post.month}/${post.slug}`;
}

export function createArticle(
  context: Context<unknown>,
  post: FederatedPost,
): Article {
  const fallback =
    post.variants.find(
      (variant) => variant.language === post.defaultLanguage,
    ) ?? post.variants[0]!;
  const canonicalUrl = new URL(post.route, siteUrl);
  const article = new Article({
    id: context.getObjectUri(Article, {
      year: post.year,
      month: post.month,
      slug: post.slug,
    }),
    attribution: context.getActorUri(actorIdentifier),
    names: [
      fallback.title,
      ...post.variants.map(
        (variant) => new LanguageString(variant.title, variant.language),
      ),
    ],
    summaries: [
      fallback.description,
      ...post.variants.map(
        (variant) => new LanguageString(variant.description, variant.language),
      ),
    ],
    contents: [
      absolutizeLocalUrls(fallback.html, canonicalUrl),
      ...post.variants.map(
        (variant) =>
          new LanguageString(
            absolutizeLocalUrls(variant.html, canonicalUrl),
            variant.language,
          ),
      ),
    ],
    mediaType: "text/html",
    published: Temporal.Instant.from(post.published),
    updated: Temporal.Instant.from(post.updated),
    urls: [
      canonicalUrl,
      ...post.variants.map(
        (variant) =>
          new Link({
            href: new URL(
              `index.${languageFiles[variant.language]}.html`,
              canonicalUrl,
            ),
            mediaType: "text/html",
            language: new Intl.Locale(variant.language),
          }),
      ),
    ],
    to: PUBLIC_COLLECTION,
    cc: context.getFollowersUri(actorIdentifier),
  });
  return article;
}

export function createPostActivity(
  context: Context<unknown>,
  post: FederatedPost,
): Create {
  const article = createArticle(context, post);
  return new Create({
    id: new URL("#create", article.id!),
    actor: context.getActorUri(actorIdentifier),
    object: article,
    published: Temporal.Instant.from(post.published),
    to: PUBLIC_COLLECTION,
    cc: context.getFollowersUri(actorIdentifier),
  });
}

export async function assertActivitySize(
  context: Context<unknown>,
  post: FederatedPost,
): Promise<void> {
  const activity = createPostActivity(context, post);
  const bytes = new TextEncoder().encode(
    JSON.stringify(await activity.toJsonLd()),
  ).byteLength;
  if (bytes > maxActivityBytes) {
    throw new Error(
      `${post.route} produces a ${bytes}-byte ActivityPub activity; ` +
        `the limit is ${maxActivityBytes} bytes.`,
    );
  }
}

export async function assertActivitySizes(
  posts: readonly FederatedPost[],
): Promise<void> {
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
    new URL(federationOrigin),
    undefined,
  );
  for (const post of posts) await assertActivitySize(context, post);
}
