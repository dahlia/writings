import type { Context } from "@netlify/functions";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../netlify/functions/on-deploy", () => ({
  enqueuePublicationSync: vi.fn(),
}));

import { enqueuePublicationSync } from "../netlify/functions/on-deploy";
import handler from "../netlify/functions/reconcile-publications";

function context(
  deployContext: string,
  published: boolean,
  siteName: string | null = "publisher",
): Context {
  return {
    deploy: { context: deployContext, id: "deploy-id", published },
    site: siteName == null ? {} : { name: siteName },
  } as Context;
}

describe("reconcile-publications", () => {
  beforeEach(() => vi.mocked(enqueuePublicationSync).mockReset());
  afterEach(() => vi.useRealTimers());

  test("enqueues reconciliation for the published production deploy", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-14T12:34:56.789Z"));
    const response = await handler(
      new Request("https://example.com/"),
      context("production", true),
    );

    expect(response.status).toBe(204);
    expect(enqueuePublicationSync).toHaveBeenCalledWith({
      id: "deploy-id",
      permalinkUrl: "https://deploy-id--publisher.netlify.app",
      publishedAt: "2026-07-14T12:34:56.789Z",
    });
  });

  test("does not enqueue reconciliation for a preview invocation", async () => {
    await handler(
      new Request("https://example.com/"),
      context("deploy-preview", false),
    );

    expect(enqueuePublicationSync).not.toHaveBeenCalled();
  });

  test("does not fall back to the mutable origin without a site name", async () => {
    await handler(
      new Request("https://example.com/"),
      context("production", true, null),
    );

    expect(enqueuePublicationSync).not.toHaveBeenCalled();
  });
});
