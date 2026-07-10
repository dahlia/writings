import type { Config, Context } from "@netlify/edge-functions";
import manifest from "./content.generated.json" with { type: "json" };
import { languageFiles, type Language } from "../../src/lib/languages.ts";
import { negotiateLanguage } from "../../src/lib/negotiate.ts";

interface ManifestEntry {
  languages: Language[];
  defaultLanguage: Language;
}

const routes = manifest as Record<string, ManifestEntry>;

export default async function handler(
  request: Request,
  context: Context,
): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD")
    return context.next();
  const url = new URL(request.url);
  const entry = routes[url.pathname];
  if (entry == null) return context.next();

  const language = negotiateLanguage(entry.languages, {
    cookie: request.headers.get("cookie"),
    acceptLanguage: request.headers.get("accept-language"),
  });
  const target = new URL(`index.${languageFiles[language]}.html`, url);
  const response = await context.next(new Request(target, request));
  const headers = new Headers(response.headers);
  const vary = new Set(
    (headers.get("vary") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
  vary.add("Accept-Language");
  vary.add("Cookie");
  headers.set("vary", [...vary].join(", "));
  return new Response(request.method === "HEAD" ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const config: Config = {
  path: ["/", "/:year/:month/:slug/"],
  onError: "bypass",
};
