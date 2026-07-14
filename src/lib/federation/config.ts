import { languages, type Language } from "../languages";
import { site, siteUrl } from "../site";

export const actorIdentifier = "hongminhee";
export const federationOrigin = new URL(
  process.env.FEDERATION_ORIGIN ?? process.env.URL ?? siteUrl,
).origin;

const primaryAuthor = site.authors[0];
if (primaryAuthor == null) throw new Error("The site has no author.");

export const actorName = primaryAuthor.name._;
export const actorNames = Object.fromEntries(
  languages.map((language) => [language, primaryAuthor.name[language]]),
) as Record<Language, string>;
export const actorSummary = site.titles._;
export const actorSummaries = Object.fromEntries(
  languages.map((language) => [language, site.titles[language]]),
) as Record<Language, string>;

export const federationKvPrefix = ["writings", "federation"] as const;
export const outboxPageSize = 10;
export const maxActivityBytes = 400_000;
export const syncEventName = "writings:sync-posts";
export const syncMaxRetries = 6;
export const publicationSyncLockTtlMs = 10 * 60_000;
export const publicationSyncLockRetryDelayMs = publicationSyncLockTtlMs + 5_000;

export type FederationServices = "disabled" | "memory" | "netlify";

export function selectFederationServices(
  context: string | undefined,
  databaseAvailable: boolean,
): FederationServices {
  if (
    context === "deploy-preview" ||
    context === "branch-deploy" ||
    context === "preview-server"
  ) {
    return "disabled";
  }
  if (context === "production") {
    return databaseAvailable ? "netlify" : "disabled";
  }
  if (context === "dev" && databaseAvailable) return "netlify";
  return "memory";
}
