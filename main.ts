import * as YAML from "std/encoding/yaml.ts";
import { parse } from "std/flags/mod.ts";
import { serve } from "std/http/server_legacy.ts";
import { info } from "std/log/mod.ts";
import { join } from "std/path/mod.ts";
import {
  Configuration as SeonbiConfiguration,
  DEFAULT_CONFIGURATION,
  Options,
  Seonbi,
} from "https://deno.land/x/seonbi@0.3.1/mod.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.0/mod.ts";
import { toWords } from "https://cdn.skypack.dev/number-to-chinese-words@1.0.20";
import toArray from "https://esm.sh/@async-generators/to-array@0.1.0";
import { renderListTemplate, renderTemplate } from "jikji/ejs.ts";
import {
  abbr,
  attrs,
  bracketedSpans,
  deflist,
  footnote,
  frontMatter,
  markdown,
  MarkdownIt,
  title,
} from "jikji/markdown.ts";
import { defaultMime } from "jikji/mime.ts";
import {
  anyRepresentations,
  Content,
  ContentKey,
  havingExtension,
  intoDirectory,
  LanguageTag,
  Pipeline,
  queryPublished,
  queryTitle,
  rebase,
  replaceBasename,
  Resource,
  scanFiles,
  setupConsoleLog,
  when,
  writeFiles,
} from "jikji/mod.ts";
import { detectLanguage } from "jikji/path.ts";
import {
  htmlRedirector,
  intoMultiView,
  phpNegotiator,
} from "jikji/multiview.ts";
import sass from "jikji/sass.ts";

// Takes CLI arguments & options:
const args = parse(Deno.args, {
  boolean: ["help", "verbose", "remove", "watch", "serve", "php"],
  default: {
    help: false,
    verbose: false,
    "base-url": null,
    "out-dir": "public_html",
    remove: false,
    watch: false,
    serve: false,
    host: "127.0.0.1",
    port: 8080,
  },
  alias: {
    h: "help",
    v: "verbose",
    o: "out-dir",
    r: "remove",
    w: "watch",
    s: "serve",
    server: "serve",
    u: "base-url",
    p: "port",
    H: "host",
  },
  unknown: (opt: string) => {
    console.error(`Unknown option: ${opt}.`);
    Deno.exit(1);
  },
});

// If -h/--help is requested, print it and exit:
if (args.help) {
  console.log("Usage: main.ts [options] [SRC=.]");
  console.log("\nOptions:");
  console.log("  -h, --help:     Show this help message and exit.");
  console.log("  -v, --verbose:  Verbose mode.");
  console.log("  -u, --base-url: Base URL.  [http://127.0.0.1:8080/]");
  console.log("  -o, --out-dir:  Output directory.  [public_html]");
  console.log("  -r, --remove:   Empty the output directory first.");
  console.log("  -s, --serve:    Run an HTTP server.");
  console.log(
    "  -H, --host:     " +
      "Hostname to listen HTTP requests.  [127.0.0.1]",
  );
  console.log("  -p, --port:     Port number to listen HTTP requests.  [8080]");
  console.log(
    "      --php:      " +
      "Build PHP files for server-side content negotiation.",
  );
  console.log("  -w, --watch:    Watch the SRC directory for changes.");
  Deno.exit(0);
}

// Makes logs show up in the console:
await setupConsoleLog(args.verbose ? ("DEBUG" as const) : ("INFO" as const));

if (
  typeof args.port != "number" ||
  args.port < 0 || args.port > 65535 || args.port % 1 !== 0
) {
  console.error("Error: -p/--port: Invalid port number.");
  Deno.exit(1);
}

if (args.php && args.serve) {
  console.error("Error: --php and -s/--serve options are mutually exclusive.");
  console.error("       Try php's built-in web server instead (`php -S`).");
  Deno.exit(1);
}

// The path of the input directory:
const srcDir: string = args._.length > 0 ? args._[0].toString() : ".";

// The path of the output directory:
const outDir: string = args["out-dir"];

// The base URL for permalinks:
const baseUrl: URL = new URL(
  args["base-url"] ?? `http://${args.host}:${args.port}/`,
);

// The site settings and metadata:
const site = YAML.parse(
  await Deno.readTextFile(join(srcDir, "site.yaml")),
) as Record<string, unknown>;

// Set of languages:
const languages = new Set<LanguageTag>(
  Object.keys(site.languageNames as Record<string, string>).map((k) =>
    LanguageTag.fromString(k)
  ),
);

// Markdown engine:
function getMarkdownIt(): typeof MarkdownIt {
  const md = new MarkdownIt("commonmark", { html: true, xhtmlOut: false })
    .enable("table")
    .use(abbr)
    .use(bracketedSpans)
    .use(attrs, { allowedAttributes: ["lang"] })
    .use(deflist)
    .use(footnote)
    .use(title);
  const footnoteCaption = md.renderer.rules.footnote_caption;
  md.renderer.rules.footnote_caption = (tokens: [unknown], idx: number) =>
    footnoteCaption(tokens, idx).replace(/^\[|\]$/g, "");
  return md;
}

// Seonbi:
const seonbiConfig: SeonbiConfiguration = {
  ...DEFAULT_CONFIGURATION,
  process: { downloadPath: ".bin/seonbi-api", distType: "stable" },
};
try {
  const seonbiPath = Deno.env.get("SEONBI_API");
  if (seonbiPath != null) seonbiConfig.process = { binPath: seonbiPath };
} catch (e) {
  if (!(e instanceof Deno.errors.PermissionDenied)) throw e;
}
const seonbi = new Seonbi(seonbiConfig);
await seonbi.start();
window.onunload = () => seonbi.stop();

// Seonbi presets:
const koKoreVPreset: Options = {
  contentType: "text/html",
  quote: "HorizontalCornerBracketsWithQ",
  cite: "CornerBracketsWithCite",
  arrow: { bidirArrow: true, doubleArrow: true },
  ellipsis: true,
  emDash: true,
  stop: "Vertical",
  hanja: null,
};
const koHangKRPreset: Options = {
  contentType: "text/html",
  quote: "CurvedSingleQuotesWithQ",
  cite: "AngleQuotesWithCite",
  arrow: { bidirArrow: true, doubleArrow: true },
  ellipsis: true,
  emDash: true,
  stop: "Horizontal",
  hanja: {
    rendering: "HangulOnly",
    reading: {
      initialSoundLaw: true,
      useDictionaries: ["kr-stdict"],
      dictionary: {},
    },
  },
};
const koKoreHPreset: Options = {
  ...koHangKRPreset,
  hanja: koKoreVPreset.hanja,
};

// Functions to format a year in various languages:
const yearFormatters: Record<string, ((y: number) => string)> = {
  "ko-Kore": (y: number) =>
    `${y.toLocaleString("zh-Hant-CN-u-nu-hanidec", { useGrouping: false })}年`,
  "ko-Hang-KR": (y: number) => `${y}년`,
};

// Functions to format a month-date in various languages:
const monthDateFormatters: Record<string, ((d: Date) => string)> = {
  "ko-Kore": (d: Date) => `${toWords(d.getMonth())}月 ${toWords(d.getDate())}日`,
  "ko-Hang-KR": (d: Date) => `${d.getMonth()}월 ${d.getDate()}일`,
};

// Extends a custom dictionary to the given Seonbi options:
async function withDictionary(
  options: Options,
  dictionary: Record<string, string> | Content,
): Promise<Options> {
  if (dictionary instanceof Content) {
    const metadata = await dictionary.getMetadata();
    if (
      typeof metadata != "object" || metadata == null ||
      typeof metadata.reads != "object" || metadata.reads == null
    ) {
      return options;
    }
    dictionary = metadata.reads as Record<string, string>;
  } else if (Object.keys(dictionary).length < 1) {
    return options;
  }

  return {
    ...options,
    hanja: options.hanja == null ? null : {
      ...options.hanja,
      reading: {
        ...options.hanja.reading,
        dictionary: {
          ...options.hanja.reading.dictionary,
          ...dictionary,
        },
      },
    },
  };
}

// The divider that turn multi-language contents into distinct files, and
// give index pages for redirecting browser to their preferred language:
const multiViewDivider = intoMultiView({
  negotiator: args.php ? phpNegotiator : htmlRedirector,
  defaultContentKey: ContentKey.get("text/html", "ko-Kore"),
});

// Text decoder:
const decoder = new TextDecoder();

// Scans for Markdown files in year directories, and static assets in static/:
const pipeline = scanFiles(["2*/**/*.md", "static/**/*"], { root: srcDir })
  // Maps the current directory to the target URL <https://example.com/>:
  // E.g.,                   ./2021/07/03/hello-world.md
  //    -> https://example.com/2021/07/03/hello-world.md
  .move(rebase("./", baseUrl))
  // If a resource's path has a suffix to indicate the language (e.g., x.en.md),
  // then configures the resource's language (e.g., en) and strips the suffix
  // from the path (e.g., x.en.md -> x.md).  As there can be multiple languages
  // for a common prefix (e.g., x.en.md and x.zh.md), these contents are merged
  // into a single resource (e.g., x.md having en and zh):
  .map(detectLanguage({ from: "pathname", strip: true }))
  // Strips .md extensions and adds trailing slashes instead:
  // E.g., 2021/07/03/hello-world.md becomes 2021/07/03/hello-world/
  .move(when(havingExtension("md"), intoDirectory()))
  // Compiles SCSS to CSS:
  .transform(sass(), { type: "text/x-scss" })
  // Replaces .scss extensions with .css:
  .move(replaceBasename(/\.s[ac]ss/, ".css"))
  // Extracts metadata from Markdown files' front matter:
  .transform(frontMatter, { type: "text/markdown" })
  // Renders posts written in Markdown to HTML:
  .transform(markdown(getMarkdownIt()), { type: "text/markdown" })
  // Generates ko-Hang-KR posts by transforming ko-Kore posts:
  .diversify(
    (c: Content) =>
      c.replace({
        async body() {
          const orig = await c.getBody();
          const text = typeof orig == "string" ? orig : decoder.decode(orig);
          return await seonbi.transform(
            text,
            await withDictionary(koHangKRPreset, c),
          );
        },
        async metadata() {
          const metadata = await c.getMetadata();
          return {
            ...metadata,
            title: await seonbi.transform(
              (metadata?.title ?? "") as string,
              await withDictionary({
                ...koHangKRPreset,
                cite: "AngleQuotes",
                contentType: "text/plain",
              }, c),
            ),
            writingMode: "horizontal",
          };
        },
        language: "ko-Hang-KR",
      }),
    { language: "ko-Kore" },
  )
  // Makes typographic adjustments on ko-Kore posts:
  .transform(
    (c: Content) =>
      c.replace({
        async body() {
          const orig = await c.getBody();
          const text = typeof orig == "string" ? orig : decoder.decode(orig);
          const metadata = await c.getMetadata();
          const preset = metadata?.writingMode === "horizontal"
            ? koKoreHPreset
            : koKoreVPreset;
          return await seonbi.transform(
            text,
            await withDictionary(preset, c),
          );
        },
        async metadata() {
          const metadata = await c.getMetadata();
          const preset = metadata?.writingMode === "horizontal"
            ? koKoreHPreset
            : koKoreVPreset;
          return {
            ...metadata,
            title: await seonbi.transform(
              (metadata?.title ?? "") as string,
              await withDictionary(
                {
                  ...preset,
                  cite: "CornerBrackets",
                  contentType: "text/plain",
                  hanja: null,
                },
                c,
              ),
            ),
            writingMode: metadata?.writingMode ?? "vertical",
          };
        },
      }),
    { language: "ko-Kore" },
  )
  // Turns multi-language posts into distinct files, and give index pages for
  // redirecting browsers to their preferred language:
  .divide(
    multiViewDivider,
    (r: Resource) => r.path.href.endsWith("/") && r.size > 1,
  )
  // Aggregate posts into feeds (for each language):
  .addSummaries(async function* (p: Pipeline) {
    for (const language of languages) {
      const posts = p.filter(
        anyRepresentations({
          type: ["text/html", "application/php"],
          language,
        }),
      );
      const feedUrl = new URL(
        `./feed.${language.toString().toLowerCase()}.xml`,
        baseUrl,
      );
      yield new Resource(feedUrl, [
        await renderListTemplate(
          "templates/feed.ejs",
          posts,
          { baseUrl, feedUrl, site },
          "application/atom+xml",
          language,
        ),
      ]);
    }
  })
  // Aggregate posts into lists (for each language):
  .addSummaries(async function* (p: Pipeline) {
    const feeds = p.filter(
      anyRepresentations({ type: ["application/atom+xml"] }),
    );
    const lists = [...languages].map(async (language: LanguageTag) => {
      const pipeline = p.filter(
        anyRepresentations({
          type: ["text/html", "application/php"],
          language,
        }),
      );
      return new Content(
        async () => [
          "",
          {
            posts: (await toArray(pipeline)).reverse(),
            feeds: (await toArray(feeds)),
            formatYear: yearFormatters[language.toString()],
            formatMonthDate: monthDateFormatters[language.toString()],
          },
        ],
        "text/html; list=1",
        language,
        await pipeline.getLastModified(),
        undefined,
        (await toArray(pipeline)).map((r) => r.path.toString()).join("\n"),
      );
    });
    yield new Resource(baseUrl, await Promise.all(lists));
  })
  // Turns multi-language lists into distinct files, and give index pages for
  // redirecting browsers to their preferred language:
  .divide(
    multiViewDivider,
    (r: Resource) => r.path.href === baseUrl.href,
  )
  // Renders the whole page for posts using the EJS template:
  .transform(
    renderTemplate("templates/post.ejs", { baseUrl, site }),
    (c: Content) => c.matches({ exactType: "text/html" }) && c.language != null,
  )
  // Renders the list pages using the EJS template:
  .transform(
    renderTemplate("templates/list.ejs", {
      baseUrl,
      site,
      queryPublished,
      queryTitle,
    }),
    { exactType: "text/html; list=1" },
  );

if (args.remove) {
  // Empty the output directory (public_html/) first:
  try {
    await Deno.remove(outDir, { recursive: true });
  } catch (e) {
    if (!(e instanceof Deno.errors.NotFound)) {
      throw e;
    }
  }
}

// Generates the static site files:
async function build(): Promise<void> {
  if (args.watch) {
    // Writes the files to the output directory (public_html/) and watches
    // the input files for changes (^C to stop):
    info(`Watching ${outDir} for changes...`);
    await pipeline.forEachWithReloading(writeFiles(outDir, baseUrl));
  } else {
    // Writes the files to the output directory (public_html/):
    await pipeline.forEach(writeFiles(outDir, baseUrl));
  }
}

// Runs an HTTP server:
async function runServer(): Promise<void> {
  const httpd = serve({ port: args.port, hostname: args.host });
  const server = staticFiles(outDir, {
    setHeaders(headers: Headers, path: string) {
      const type = defaultMime.getType(path);
      if (type != null) {
        headers.set("Content-Type", type);
      }
    },
  });
  info(`Listening on http://${args.host}:${args.port}/`);
  for await (const req of httpd) {
    await server(req);
  }
}

await Promise.all(args.serve ? [build(), runServer()] : [build()]);
