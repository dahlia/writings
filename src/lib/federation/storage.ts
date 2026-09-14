import type { KvStore } from "@fedify/fedify";
import { getContext } from "@netlify/functions";

export const blobsStoreName = "fedify";
export const storageReadyKey = ["writings", "storage", "ready"] as const;
export const queueEventName = "fedify:queue";

export type FederationServices = "disabled" | "memory" | "postgres" | "blobs";

export function getDeployContext(): string | undefined {
  try {
    return getContext().deploy.context;
  } catch {
    return process.env.CONTEXT;
  }
}

export function isFederationMaintenance(): boolean {
  return process.env.FEDERATION_MAINTENANCE === "true";
}

export function selectFederationServices(
  context: string | undefined,
  databaseAvailable: boolean,
  storage = process.env.FEDERATION_STORAGE,
  astroDev = false,
): FederationServices {
  if (context == null) return astroDev ? "memory" : "disabled";
  if (context !== "production" && context !== "dev") return "disabled";
  if (storage != null && storage !== "postgres" && storage !== "blobs") {
    throw new Error("Invalid FEDERATION_STORAGE; choose postgres or blobs.");
  }
  if (storage === "blobs" || (context === "dev" && storage == null)) {
    return "blobs";
  }
  return databaseAvailable ? "postgres" : "disabled";
}

export async function assertBlobsReady(
  kv: KvStore,
  origin: string,
): Promise<void> {
  const marker = await kv.get<{ version?: number; origin?: string }>(
    storageReadyKey,
  );
  if (marker?.version !== 1 || marker.origin !== origin) {
    throw new Error("Blobs migration is not ready for this federation origin.");
  }
}
