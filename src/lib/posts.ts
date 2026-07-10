import { getCollection, type CollectionEntry } from "astro:content";
import type { Language } from "./languages";

export type Post = CollectionEntry<"posts">;

export async function allPosts(): Promise<Post[]> {
  return getCollection("posts");
}

export async function postsIn(language: Language): Promise<Post[]> {
  return (await allPosts())
    .filter((post) => post.data.language === language)
    .sort(
      (left, right) =>
        new Date(right.data.published).getTime() -
        new Date(left.data.published).getTime(),
    );
}
