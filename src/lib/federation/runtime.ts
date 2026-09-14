import { builder, type FederationContextData } from "./builder";
import { federationOrigin, selectFederationServices } from "./config";
import { getFederatedPosts } from "./posts";
import {
  createMemoryServices,
  createNetlifyServices,
  hasNetlifyDatabase,
} from "./services";
import { getDeployContext } from "./storage";

export interface WebRuntime {
  readonly enabled: boolean;
  readonly federation?: Awaited<ReturnType<typeof builder.build>>;
  readonly contextData?: FederationContextData;
}

function selectWebServices() {
  const deployContext = getDeployContext();
  const servicesKind = selectFederationServices(
    deployContext,
    (deployContext === "production" || deployContext === "dev") &&
      process.env.FEDERATION_STORAGE !== "blobs" &&
      (deployContext !== "dev" || process.env.FEDERATION_STORAGE === "postgres")
      ? hasNetlifyDatabase()
      : false,
    process.env.FEDERATION_STORAGE,
    import.meta.env.DEV,
  );
  return { deployContext, servicesKind };
}

export function isFederationRuntimeEnabled(): boolean {
  return selectWebServices().servicesKind !== "disabled";
}

export async function createWebRuntime(): Promise<WebRuntime> {
  const { deployContext, servicesKind } = selectWebServices();
  if (servicesKind === "disabled") return { enabled: false };

  const useNetlify = servicesKind !== "memory";
  const services = useNetlify
    ? await createNetlifyServices({
        origin: federationOrigin,
        baseUrl:
          process.env.FEDERATION_BASE_URL ??
          (deployContext === "dev"
            ? "http://localhost:8888"
            : federationOrigin),
      })
    : createMemoryServices();
  const contextData: FederationContextData = {
    kv: services.kv,
    getPosts: getFederatedPosts,
  };
  return {
    enabled: true,
    federation: await builder.build({
      kv: services.kv,
      queue: services.queue,
      manuallyStartQueue: useNetlify,
      ...(deployContext === "production"
        ? {
            origin: {
              handleHost: new URL(federationOrigin).host,
              webOrigin: federationOrigin,
            },
          }
        : {}),
    }),
    contextData,
  };
}
