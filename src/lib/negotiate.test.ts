import { describe, expect, test } from "vitest";
import { negotiateLanguage } from "./negotiate";

const all = ["en", "ko-Hang-KR", "ko-Kore", "ja"] as const;

describe("negotiateLanguage", () => {
  test("uses an explicit language cookie before request headers", () => {
    expect(
      negotiateLanguage(all, {
        cookie: "theme=dark; accept-language=ja",
        acceptLanguage: "en-US,en;q=0.9",
      }),
    ).toBe("ja");
  });

  test("ignores malformed encoded language cookies", () => {
    expect(
      negotiateLanguage(all, {
        cookie: "accept-language=%E0%A4%A",
        acceptLanguage: "ja",
      }),
    ).toBe("ja");
    expect(
      negotiateLanguage(all, {
        cookie: "accept-language=%E0%A4%A; accept-language=ko-Hang-KR",
        acceptLanguage: "ja",
      }),
    ).toBe("ko-Hang-KR");
  });

  test("maps South Korean locale preferences to the Hangul representation", () => {
    expect(negotiateLanguage(all, { acceptLanguage: "ko-KR" })).toBe(
      "ko-Hang-KR",
    );
    expect(negotiateLanguage(all, { acceptLanguage: "ko-Hang-KR" })).toBe(
      "ko-Hang-KR",
    );
  });

  test("maps a bare Korean preference to mixed-script Korean", () => {
    expect(negotiateLanguage(all, { acceptLanguage: "ko" })).toBe("ko-Kore");
  });

  test("honors quality values", () => {
    expect(
      negotiateLanguage(all, { acceptLanguage: "ja;q=0.5,en-US;q=0.9" }),
    ).toBe("en");
  });

  test("parses quality parameters case-insensitively and rejects malformed values", () => {
    expect(
      negotiateLanguage(["en", "ja"], {
        acceptLanguage: "en;Q=0, ja;q=0.5",
      }),
    ).toBe("ja");
    expect(negotiateLanguage(all, { acceptLanguage: "en;q=, *;q=0.5" })).toBe(
      "en",
    );
  });

  test("uses the quality of the most specific matching range", () => {
    expect(
      negotiateLanguage(["ko-Hang-KR", "en"], {
        acceptLanguage: "ko;q=1, ko-Hang-KR;q=0.5, en;q=0.8",
      }),
    ).toBe("en");
  });

  test("does not let a wildcard override a zero-quality exclusion", () => {
    expect(negotiateLanguage(all, { acceptLanguage: "en;q=0, *;q=1" })).toBe(
      "ko-Hang-KR",
    );
  });

  test("uses the most specific range when applying an exclusion", () => {
    expect(
      negotiateLanguage(["ko-Hang-KR", "ko-Kore"], {
        acceptLanguage: "ko-Hang-KR;q=0, ko;q=1",
      }),
    ).toBe("ko-Kore");
    expect(
      negotiateLanguage(["ko-Hang-KR"], {
        acceptLanguage: "ko;q=0, ko-Hang-KR;q=0.5, *;q=1",
      }),
    ).toBe("ko-Hang-KR");
  });

  test("falls back to English when the request is empty or unsupported", () => {
    expect(negotiateLanguage(all, {})).toBe("en");
    expect(negotiateLanguage(all, { acceptLanguage: "fr-FR" })).toBe("en");
  });

  test("falls back to mixed-script Korean when English is unavailable", () => {
    expect(
      negotiateLanguage(["ko-Hang-KR", "ko-Kore"], { acceptLanguage: "fr" }),
    ).toBe("ko-Kore");
  });

  test("ignores an unavailable cookie representation", () => {
    expect(
      negotiateLanguage(["ko-Hang-KR", "ko-Kore"], {
        cookie: "accept-language=en",
        acceptLanguage: "ko-KR",
      }),
    ).toBe("ko-Hang-KR");
  });
});
