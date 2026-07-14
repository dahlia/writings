import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import remarkAbbr from "@richardtowers/remark-abbr";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import netlify from "@astrojs/netlify";
import { fedifyIntegration } from "@fedify/astro";
import { siteUrl } from "./src/lib/site";

export default defineConfig({
  site: siteUrl.href,
  output: "server",
  adapter: netlify(),
  integrations: [fedifyIntegration()],
  build: {
    format: "preserve",
  },
  markdown: {
    processor: unified({
      gfm: false,
      remarkPlugins: [remarkGfm, remarkAbbr],
      rehypePlugins: [rehypeRaw],
      remarkRehype: {
        allowDangerousHtml: true,
        handlers: {
          abbrDefinition: () => undefined,
        },
      },
      smartypants: false,
    }),
  },
});
