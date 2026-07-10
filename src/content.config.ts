import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { postsLoader } from "./loaders/posts";

const posts = defineCollection({
  loader: postsLoader(),
  schema: z.object({
    route: z.string(),
    year: z.string(),
    month: z.string(),
    slug: z.string(),
    language: z.enum(["en", "ko-Hang-KR", "ko-Kore", "ja"]),
    availableLanguages: z.array(z.enum(["en", "ko-Hang-KR", "ko-Kore", "ja"])),
    published: z.string(),
    updated: z.string(),
    title: z.string(),
    titleHtml: z.string(),
    description: z.string(),
    html: z.string(),
    writingMode: z.enum(["horizontal", "vertical"]),
    sourcePath: z.string(),
  }),
});

export const collections = { posts };
