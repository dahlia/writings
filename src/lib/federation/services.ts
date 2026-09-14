import { InProcessMessageQueue, MemoryKvStore } from "@fedify/fedify";
import { NetlifyBlobsKvStore, NetlifyMessageQueue } from "@fedify/netlify";
import { getStore } from "@netlify/blobs";
import { PostgresKvStore } from "@fedify/postgres";
import { AsyncWorkloadsClient } from "@netlify/async-workloads";
import {
  getConnectionString,
  MissingDatabaseConnectionError,
} from "@netlify/database";
import postgres from "postgres";
import {
  assertBlobsReady,
  blobsStoreName,
  getDeployContext,
  queueEventName,
  selectFederationServices,
} from "./storage";

export interface NetlifyServicesOptions {
  readonly baseUrl?: string;
  readonly origin: string;
}

let legacySql: ReturnType<typeof postgres> | undefined;

export function hasNetlifyDatabase(): boolean {
  try {
    getConnectionString();
    return true;
  } catch (error) {
    if (error instanceof MissingDatabaseConnectionError) return false;
    throw error;
  }
}

export async function createNetlifyServices(options: NetlifyServicesOptions) {
  const context = getDeployContext();
  const kind = selectFederationServices(
    context,
    (context === "production" || context === "dev") &&
      process.env.FEDERATION_STORAGE !== "blobs" &&
      (context !== "dev" || process.env.FEDERATION_STORAGE === "postgres")
      ? hasNetlifyDatabase()
      : false,
  );
  if (kind !== "postgres" && kind !== "blobs") {
    throw new Error(
      "Persistent federation services are unavailable in this context.",
    );
  }
  const kv =
    kind === "blobs"
      ? new NetlifyBlobsKvStore(
          getStore({ name: blobsStoreName, consistency: "strong" }),
        )
      : new PostgresKvStore((legacySql ??= postgres(getConnectionString())));
  if (kind === "blobs" && context === "production") {
    await assertBlobsReady(kv, options.origin);
  }
  const queue = new NetlifyMessageQueue({
    eventName: queueEventName,
    client: new AsyncWorkloadsClient(
      options.baseUrl == null ? undefined : { baseUrl: options.baseUrl },
    ),
    orderingKv: kv,
  });
  return { kv, queue };
}

export function createMemoryServices() {
  return {
    kv: new MemoryKvStore(),
    queue: new InProcessMessageQueue(),
  };
}
