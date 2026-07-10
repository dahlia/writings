import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import remarkAbbr from "@richardtowers/remark-abbr";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default defineConfig({
  site: "https://writings.hongminhee.org/",
  output: "static",
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
