import { isLanguage, type Language } from "./languages.ts";

export interface NegotiationInput {
  cookie?: string | null;
  acceptLanguage?: string | null;
}

export function defaultLanguage(available: readonly Language[]): Language {
  if (available.includes("en")) return "en";
  if (available.includes("ko-Kore")) return "ko-Kore";
  if (available.includes("ko-Hang-KR")) return "ko-Hang-KR";
  return available[0] ?? "ko-Kore";
}

function cookieLanguage(
  cookie: string | null | undefined,
): Language | undefined {
  if (cookie == null) return undefined;
  for (const item of cookie.split(";")) {
    const [name = "", ...valueParts] = item.trim().split("=");
    if (name.toLowerCase() !== "accept-language") continue;
    let value: string;
    try {
      value = decodeURIComponent(valueParts.join("="));
    } catch {
      continue;
    }
    const language = ["en", "ko-Hang-KR", "ko-Kore", "ja"].find(
      (candidate) => candidate.toLowerCase() === value.toLowerCase(),
    );
    if (language != null && isLanguage(language)) return language;
  }
  return undefined;
}

function matchScore(requested: string, candidate: Language): number {
  const request = requested.toLowerCase();
  const target = candidate.toLowerCase();
  if (request === target) return 100;
  if (request === "*") return 1;

  const [primary, script, region] = request.split("-");
  if (primary !== target.split("-")[0]) return 0;
  if (primary !== "ko") return 80;

  if (script === "hang") return candidate === "ko-Hang-KR" ? 95 : 60;
  if (script === "kore") return candidate === "ko-Kore" ? 95 : 60;
  if (script === "kr" || region === "kr") {
    return candidate === "ko-Hang-KR" ? 90 : 70;
  }
  return candidate === "ko-Kore" ? 90 : 80;
}

export function negotiateLanguage(
  available: readonly Language[],
  input: NegotiationInput = {},
): Language {
  const cookie = cookieLanguage(input.cookie);
  if (cookie != null && available.includes(cookie)) return cookie;

  const ranges: Array<{ tag: string; quality: number; order: number }> = [];
  for (const [order, item] of (input.acceptLanguage ?? "")
    .split(",")
    .entries()) {
    const [rawTag = "", ...parameters] = item.trim().split(";");
    if (rawTag === "") continue;
    const qualityParameter = parameters
      .map((parameter) => parameter.trim())
      .find((parameter) => /^q=/i.test(parameter));
    let quality = 1;
    if (qualityParameter != null) {
      const value = qualityParameter.slice(2);
      if (!/^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(value)) continue;
      quality = Number(value);
    }
    ranges.push({ tag: rawTag, quality, order });
  }

  let winner:
    | { language: Language; quality: number; score: number; order: number }
    | undefined;
  for (const language of available) {
    let match: { quality: number; score: number; order: number } | undefined;
    for (const { tag, quality, order } of ranges) {
      const score = matchScore(tag, language);
      if (score === 0) continue;
      if (
        match == null ||
        score > match.score ||
        (score === match.score && order < match.order)
      ) {
        match = { quality, score, order };
      }
    }
    if (match == null || match.quality === 0) continue;
    if (
      winner == null ||
      match.quality > winner.quality ||
      (match.quality === winner.quality && match.score > winner.score) ||
      (match.quality === winner.quality &&
        match.score === winner.score &&
        match.order < winner.order)
    ) {
      winner = { language, ...match };
    }
  }
  return winner?.language ?? defaultLanguage(available);
}
