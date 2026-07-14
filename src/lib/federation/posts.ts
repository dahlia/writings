import { getCollection } from "astro:content";
import { groupFederatedPosts, type FederatedPost } from "./model";

export async function getFederatedPosts(): Promise<FederatedPost[]> {
  return groupFederatedPosts(
    (await getCollection("posts")).map((post) => ({
      year: post.data.year,
      month: post.data.month,
      slug: post.data.slug,
      route: post.data.route,
      published: post.data.published,
      updated: post.data.updated,
      language: post.data.language,
      title: post.data.title,
      description: post.data.description,
      html: post.data.html,
    })),
  );
}
