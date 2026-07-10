import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import fg from "fast-glob";

const languages = ["en", "ko-Hang-KR", "ko-Kore", "ja"];
const paths = await fg("20*/**/*.md", { onlyFiles: true });
const manifest = {
  "/": { languages, defaultLanguage: "en" },
};

for (const path of paths) {
  const match = /^(20\d{2})\/(\d{1,2})\/(.+)\.([^.]+)\.md$/.exec(path);
  if (match == null) continue;
  const [, year, month, slug, language] = match;
  const route = `/${year}/${month}/${slug}/`;
  manifest[route] ??= { languages: [], defaultLanguage: "ko-Kore" };
  if (!manifest[route].languages.includes(language))
    manifest[route].languages.push(language);
  if (
    language === "ko-Kore" &&
    !manifest[route].languages.includes("ko-Hang-KR")
  ) {
    manifest[route].languages.push("ko-Hang-KR");
  }
}

for (const entry of Object.values(manifest)) {
  entry.languages.sort(
    (left, right) => languages.indexOf(left) - languages.indexOf(right),
  );
  entry.defaultLanguage = entry.languages.includes("en") ? "en" : "ko-Kore";
}

const output = resolve("netlify/edge-functions/content.generated.json");
await mkdir(resolve("netlify/edge-functions"), { recursive: true });
await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`);
