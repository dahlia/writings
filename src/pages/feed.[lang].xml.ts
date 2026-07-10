import type { APIRoute } from "astro";
import { languageFiles, languages, type Language } from "../lib/languages";
import { escapeXml } from "../lib/html";
import { postsIn } from "../lib/posts";
import { site, siteUrl } from "../lib/site";

export function getStaticPaths() {
  return languages.map((language) => ({
    params: { lang: languageFiles[language] },
    props: { language },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const language = props.language as Language;
  const posts = await postsIn(language);
  const feedUrl = new URL(`feed.${languageFiles[language]}.xml`, siteUrl);
  const updated = posts.reduce(
    (latest, post) =>
      new Date(post.data.updated).getTime() > latest.getTime()
        ? new Date(post.data.updated)
        : latest,
    new Date(0),
  );
  const authors = site.authors
    .map(
      (author) => `  <author>
    <name>${escapeXml(author.name[language])}</name>
    ${author.uri == null ? "" : `<uri>${escapeXml(author.uri)}</uri>`}
    ${author.email == null ? "" : `<email>${escapeXml(author.email)}</email>`}
  </author>`,
    )
    .join("\n");
  const entries = posts
    .map((post) => {
      const canonicalUrl = new URL(post.data.route, siteUrl);
      const alternates = post.data.availableLanguages
        .map(
          (alternate) =>
            `    <link rel="alternate" href="${escapeXml(new URL(`index.${languageFiles[alternate]}.html`, canonicalUrl).href)}" hreflang="${alternate}" />`,
        )
        .join("\n");
      return `  <entry>
    <title>${escapeXml(post.data.title)}</title>
    <link rel="alternate" href="${escapeXml(canonicalUrl.href)}" />
    <id>${escapeXml(canonicalUrl.href)}</id>
${alternates}
    <published>${post.data.published}</published>
    <updated>${post.data.updated}</updated>
    <content type="html">${escapeXml(post.data.html)}</content>
  </entry>`;
    })
    .join("\n\n");

  const body = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${language}">
  <id>${escapeXml(feedUrl.href)}</id>
  <link rel="self" type="application/atom+xml" href="${escapeXml(feedUrl.href)}" />
  <link rel="alternate" type="text/html" href="${escapeXml(siteUrl.href)}" />
  <generator uri="https://astro.build/">Astro</generator>
  <title>${escapeXml(site.titles[language])}</title>
${authors}
  <updated>${updated.toISOString()}</updated>

${entries}
</feed>
`;
  return new Response(body, {
    headers: { "content-type": "application/atom+xml; charset=utf-8" },
  });
};
