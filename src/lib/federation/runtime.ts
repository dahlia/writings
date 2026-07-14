import { getContext } from "@netlify/functions";
import { builder, type FederationContextData } from "./builder";
import { federationOrigin, selectFederationServices } from "./config";
import { getFederatedPosts } from "./posts";
import {
  createMemoryServices,
  createNetlifyServices,
  hasNetlifyDatabase,
} from "./services";

export interface WebRuntime {
  readonly enabled: boolean;
  readonly federation?: Awaited<ReturnType<typeof builder.build>>;
  readonly contextData?: FederationContextData;
}

export function getDeployContext(): string | undefined {
  try {
    return getContext().deploy.context;
  } catch {
    return process.env.CONTEXT;
  }
}

export function isFederationRuntimeEnabled(): boolean {
  return (
    selectFederationServices(getDeployContext(), hasNetlifyDatabase()) !==
    "disabled"
  );
}

export async function createWebRuntime(): Promise<WebRuntime> {
  const deployContext = getDeployContext();
  const servicesKind = selectFederationServices(
    deployContext,
    hasNetlifyDatabase(),
  );
  if (servicesKind === "disabled") return { enabled: false };

  const useNetlify = servicesKind === "netlify";
  const services = useNetlify
    ? createNetlifyServices({
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
