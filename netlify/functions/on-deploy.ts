import type {
  Deploy,
  DeploySucceededEvent,
  DeployUnlockedEvent,
} from "@netlify/functions";
import { AsyncWorkloadsClient } from "@netlify/async-workloads";
import { syncEventName } from "../../src/lib/federation/config";

interface PublicationDeploy {
  readonly id: string;
  readonly permalinkUrl: string;
  readonly publishedAt: string;
}

export async function enqueuePublicationSync(
  deploy?: PublicationDeploy,
): Promise<void> {
  const result = await new AsyncWorkloadsClient().send(syncEventName, {
    data:
      deploy == null
        ? {}
        : {
            deployId: deploy.id,
            deployUrl: deploy.permalinkUrl,
            publishedAt: deploy.publishedAt,
          },
  });
  if (result.sendStatus !== "succeeded") {
    throw new Error(`Failed to enqueue publication sync ${result.eventId}.`);
  }
}

async function reconcilePublishedDeploy(deploy: Deploy): Promise<void> {
  if (deploy.context !== "production" || deploy.publishedAt == null) return;
  await enqueuePublicationSync({
    id: deploy.id,
    permalinkUrl: deploy.permalinkUrl,
    publishedAt: deploy.publishedAt,
  });
}

export default {
  async deploySucceeded(event: DeploySucceededEvent) {
    await reconcilePublishedDeploy(event.deploy);
  },
  async deployUnlocked(event: DeployUnlockedEvent) {
    await reconcilePublishedDeploy(event.deploy);
  },
};
