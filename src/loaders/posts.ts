import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { relative, resolve } from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import type { Loader, LoaderContext } from "astro/loaders";
import {
  extractDescription,
  extractTitle,
  extractTitleHtml,
} from "../lib/html";
import { isLanguage, type Language } from "../lib/languages";
import {
  koHangKRPreset,
  koKoreHorizontalPreset,
  koKoreVerticalPreset,
  transform,
  withDictionary,
} from "../lib/seonbi";

const execFileAsync = promisify(execFile);
const root = resolve(new URL("../..", import.meta.url).pathname);
const sourcePattern = "20*/**/*.md";
const sourceFilePattern = /^(20\d{2})\/(\d{1,2})\/(.+)\.([^.]+)\.md$/;

interface SourcePost {
  filePath: string;
  absolutePath: string;
  route: string;
  year: string;
  month: string;
  slug: string;
  language: Exclude<Language, "ko-Hang-KR">;
  published: string;
  updated: string;
  reads: Record<string, string>;
  description?: string;
  writingMode?: "horizontal" | "vertical";
  markdown: string;
}

export async function lastModified(
  filePath: string,
  fallback: string,
): Promise<string> {
  const { stdout } = await execFileAsync(
    "git",
    ["log", "-1", "--format=%cI", "--", filePath],
    { cwd: root },
  );
  const value = stdout.trim();
  if (value === "") return fallback;
  return new Date(value).toISOString();
}

async function readSource(filePath: string): Promise<SourcePost> {
  const match = sourceFilePattern.exec(filePath);
  if (match == null) throw new Error(`Invalid post path: ${filePath}`);
  const year = match[1]!;
  const month = match[2]!;
  const slug = match[3]!;
  const rawLanguage = match[4]!;
  if (!isLanguage(rawLanguage) || rawLanguage === "ko-Hang-KR") {
    throw new Error(
      `Unsupported source language in ${filePath}: ${rawLanguage}`,
    );
  }

  const absolutePath = resolve(root, filePath);
  const parsed = matter(await readFile(absolutePath, "utf8"));
  if (parsed.data.published == null) {
    throw new Error(`Missing published front matter in ${filePath}`);
  }
  const published = new Date(parsed.data.published);
  if (Number.isNaN(published.getTime())) {
    throw new Error(`Invalid published front matter in ${filePath}`);
  }
  const writingMode = parsed.data.writingMode;
  if (
    writingMode != null &&
    writingMode !== "horizontal" &&
    writingMode !== "vertical"
  ) {
    throw new Error(`Invalid writingMode front matter in ${filePath}`);
  }
  const publishedAt = published.toISOString();

  return {
    filePath,
    absolutePath,
    route: `/${year}/${month}/${slug}/`,
    year,
    month,
    slug,
    language: rawLanguage,
    published: publishedAt,
    updated: await lastModified(filePath, publishedAt),
    reads: (parsed.data.reads ?? {}) as Record<string, string>,
    description: parsed.data.description,
    writingMode,
    markdown: parsed.content,
  };
}

function englishTypography(html: string): string {
  return html
    .replaceAll("---", "–")
    .replaceAll("--", "—")
    .replaceAll("...", "…");
}

async function loadPosts(context: LoaderContext): Promise<void> {
  const paths = await fg(sourcePattern, { cwd: root, onlyFiles: true });
  paths.sort();
  const sources: SourcePost[] = [];
  for (const path of paths) sources.push(await readSource(path));

  const groups = Map.groupBy(sources, (source) => source.route);
  for (const [route, group] of groups) {
    if (!group.some((source) => source.language === "ko-Kore")) {
      throw new Error(
        `${route} has no ko-Kore source from which to derive ko-Hang-KR`,
      );
    }
    const published = new Set(group.map((source) => source.published));
    if (published.size !== 1) {
      throw new Error(
        `${route} has inconsistent published dates across translations`,
      );
    }
  }

  context.store.clear();
  for (const source of sources) {
    const rendered = await context.renderMarkdown(source.markdown, {
      fileURL: new URL(`file://${source.absolutePath}`),
    });
    const sourceTitle = extractTitle(rendered.html);
    if (sourceTitle == null)
      throw new Error(`Missing level-one title in ${source.filePath}`);
    const sourceTitleHtml = extractTitleHtml(rendered.html);
    if (sourceTitleHtml == null)
      throw new Error(`Missing level-one title in ${source.filePath}`);

    const group = groups.get(source.route) ?? [];
    const availableLanguages = group.flatMap((entry): Language[] =>
      entry.language === "ko-Kore"
        ? ["ko-Kore", "ko-Hang-KR"]
        : [entry.language],
    );

    const variants: Array<{
      language: Language;
      title: string;
      titleHtml: string;
      html: string;
      writingMode: "horizontal" | "vertical";
    }> = [];

    if (source.language === "ko-Kore") {
      const preset =
        source.writingMode === "horizontal"
          ? koKoreHorizontalPreset
          : koKoreVerticalPreset;
      variants.push({
        language: "ko-Kore",
        title: await transform(
          sourceTitle,
          withDictionary(
            {
              ...preset,
              contentType: "text/plain",
              cite: "CornerBrackets",
              hanja: null,
            },
            source.reads,
          ),
        ),
        titleHtml: await transform(
          sourceTitleHtml,
          withDictionary(
            {
              ...preset,
              contentType: "text/html",
              hanja: null,
            },
            source.reads,
          ),
        ),
        html: await transform(
          rendered.html,
          withDictionary(preset, source.reads),
        ),
        writingMode: source.writingMode ?? "vertical",
      });
      variants.push({
        language: "ko-Hang-KR",
        title: await transform(
          sourceTitle,
          withDictionary(
            {
              ...koHangKRPreset,
              contentType: "text/plain",
              cite: "AngleQuotes",
            },
            source.reads,
          ),
        ),
        titleHtml: await transform(
          sourceTitleHtml,
          withDictionary(koHangKRPreset, source.reads),
        ),
        html: await transform(
          rendered.html,
          withDictionary(koHangKRPreset, source.reads),
        ),
        writingMode: "horizontal",
      });
    } else {
      variants.push({
        language: source.language,
        title: sourceTitle,
        titleHtml:
          source.language === "en"
            ? englishTypography(sourceTitleHtml)
            : sourceTitleHtml,
        html:
          source.language === "en"
            ? englishTypography(rendered.html)
            : rendered.html,
        writingMode:
          source.writingMode ??
          (source.language === "ja" ? "vertical" : "horizontal"),
      });
    }

    for (const variant of variants) {
      const id = `${source.year}/${source.month}/${source.slug}/${variant.language}`;
      const data = await context.parseData({
        id,
        filePath: source.filePath,
        data: {
          route: source.route,
          year: source.year,
          month: source.month,
          slug: source.slug,
          language: variant.language,
          availableLanguages,
          published: source.published,
          updated: source.updated,
          title: variant.title,
          titleHtml: variant.titleHtml,
          description: source.description ?? extractDescription(variant.html),
          html: variant.html,
          writingMode: variant.writingMode,
          sourcePath: source.filePath,
        },
      });
      context.store.set({
        id,
        data,
        body: source.markdown,
        filePath: source.filePath,
        digest: context.generateDigest(
          `${source.filePath}\0${source.markdown}\0${variant.html}`,
        ),
        rendered: { ...rendered, html: variant.html },
      });
    }
  }

  context.watcher?.add(paths.map((path) => resolve(root, path)));
  context.logger.info(
    `Loaded ${context.store.keys().length} language variants from ${sources.length} sources`,
  );
}

export function postsLoader(): Loader {
  let watching = false;
  return {
    name: "writings-posts",
    async load(context) {
      await loadPosts(context);
      if (context.watcher == null || watching) return;
      watching = true;
      const reload = async (changedPath: string) => {
        const path = relative(root, changedPath);
        if (sourceFilePattern.test(path)) await loadPosts(context);
      };
      context.watcher.on("add", reload);
      context.watcher.on("change", reload);
      context.watcher.on("unlink", reload);
    },
  };
}
