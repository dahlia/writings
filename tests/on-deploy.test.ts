import type {
  DeploySucceededEvent,
  DeployUnlockedEvent,
} from "@netlify/functions";
import { beforeEach, describe, expect, test, vi } from "vitest";

const send = vi.fn();

vi.mock("@netlify/async-workloads", () => ({
  AsyncWorkloadsClient: class {
    send = send;
  },
}));

import handler from "../netlify/functions/on-deploy";
import { syncEventName } from "../src/lib/federation/config";

function event(
  overrides: Partial<DeploySucceededEvent["deploy"]> = {},
): DeploySucceededEvent {
  return {
    deploy: {
      id: "deploy-id",
      context: "production",
      publishedAt: "2026-07-14T00:00:00.000Z",
      permalinkUrl: "https://deploy-id--publisher.netlify.app",
      ...overrides,
    },
    site: {},
  } as DeploySucceededEvent;
}

describe("publication deploy events", () => {
  beforeEach(() => {
    send.mockReset();
    send.mockResolvedValue({ eventId: "event-id", sendStatus: "succeeded" });
  });

  test("pins a published production deploy in the sync event", async () => {
    await handler.deploySucceeded?.(event());

    expect(send).toHaveBeenCalledWith(syncEventName, {
      data: {
        deployId: "deploy-id",
        deployUrl: "https://deploy-id--publisher.netlify.app",
        publishedAt: "2026-07-14T00:00:00.000Z",
      },
    });
  });

  test("ignores a production deploy that has not been published", async () => {
    await handler.deploySucceeded?.(event({ publishedAt: null }));

    expect(send).not.toHaveBeenCalled();
  });

  test("ignores deploy previews", async () => {
    await handler.deploySucceeded?.(
      event({ context: "deploy-preview", publishedAt: null }),
    );

    expect(send).not.toHaveBeenCalled();
  });

  test("reconciles the production deploy published by unlocking", async () => {
    await handler.deployUnlocked?.(event() as DeployUnlockedEvent);

    expect(send).toHaveBeenCalledWith(syncEventName, {
      data: {
        deployId: "deploy-id",
        deployUrl: "https://deploy-id--publisher.netlify.app",
        publishedAt: "2026-07-14T00:00:00.000Z",
      },
    });
  });
});
