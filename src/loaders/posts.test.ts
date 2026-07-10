import { describe, expect, test } from "vitest";
import { lastModified } from "./posts";

describe("lastModified", () => {
  test("uses the published time when a post has no Git history", async () => {
    const published = "2099-01-02T03:04:05.000Z";
    await expect(
      lastModified("2099/01/untracked-post.ko-Kore.md", published),
    ).resolves.toBe(published);
  });
});
