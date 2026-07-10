import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import type { Language } from "./languages";

interface Author {
  name: Record<Language, string>;
  uri?: string;
  email?: string;
}

interface Site {
  titles: Record<Language, string>;
  languageNames: Record<Language, string>;
  descriptions?: Partial<Record<Language, string>>;
  authors: Author[];
  head?: string;
}

export const site = parse(
  readFileSync(resolve(process.cwd(), "site.yaml"), "utf8"),
) as Site;

export const siteUrl = new URL("https://writings.hongminhee.org/");
