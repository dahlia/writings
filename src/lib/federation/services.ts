import { InProcessMessageQueue, MemoryKvStore } from "@fedify/fedify";
import { NetlifyMessageQueue } from "@fedify/netlify";
import { PostgresKvStore } from "@fedify/postgres";
import { AsyncWorkloadsClient } from "@netlify/async-workloads";
import {
  getConnectionString,
  MissingDatabaseConnectionError,
} from "@netlify/database";
import postgres from "postgres";

export interface NetlifyServicesOptions {
  readonly baseUrl?: string;
}

export function hasNetlifyDatabase(): boolean {
  try {
    getConnectionString();
    return true;
  } catch (error) {
    if (error instanceof MissingDatabaseConnectionError) return false;
    throw error;
  }
}

export function createNetlifyServices(options: NetlifyServicesOptions = {}) {
  const sql = postgres(getConnectionString());
  const kv = new PostgresKvStore(sql);
  const queue = new NetlifyMessageQueue({
    client: new AsyncWorkloadsClient(
      options.baseUrl == null ? undefined : { baseUrl: options.baseUrl },
    ),
    orderingKv: kv,
  });
  return { kv, queue, sql };
}

export function createMemoryServices() {
  return {
    kv: new MemoryKvStore(),
    queue: new InProcessMessageQueue(),
  };
}
