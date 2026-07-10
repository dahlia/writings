export type SeonbiOptions = {
  contentType: "text/html" | "text/plain";
  quote: "CurvedSingleQuotesWithQ" | "HorizontalCornerBracketsWithQ" | null;
  cite:
    | "AngleQuotes"
    | "AngleQuotesWithCite"
    | "CornerBrackets"
    | "CornerBracketsWithCite"
    | null;
  arrow: { bidirArrow: boolean; doubleArrow: boolean } | null;
  ellipsis: boolean;
  emDash: boolean;
  stop: "Horizontal" | "Vertical" | null;
  hanja: {
    rendering: "HangulOnly" | "HanjaInRuby";
    reading: {
      initialSoundLaw: boolean;
      useDictionaries: ["kr-stdict"];
      dictionary: Record<string, string>;
    };
  } | null;
};

export const koKoreVerticalPreset: SeonbiOptions = {
  contentType: "text/html",
  quote: "HorizontalCornerBracketsWithQ",
  cite: "CornerBracketsWithCite",
  arrow: { bidirArrow: true, doubleArrow: true },
  ellipsis: true,
  emDash: true,
  stop: "Vertical",
  hanja: {
    rendering: "HanjaInRuby",
    reading: {
      initialSoundLaw: true,
      useDictionaries: ["kr-stdict"],
      dictionary: {},
    },
  },
};

export const koHangKRPreset: SeonbiOptions = {
  contentType: "text/html",
  quote: "CurvedSingleQuotesWithQ",
  cite: "AngleQuotesWithCite",
  arrow: { bidirArrow: true, doubleArrow: true },
  ellipsis: true,
  emDash: true,
  stop: "Horizontal",
  hanja: {
    rendering: "HangulOnly",
    reading: {
      initialSoundLaw: true,
      useDictionaries: ["kr-stdict"],
      dictionary: {},
    },
  },
};

export const koKoreHorizontalPreset: SeonbiOptions = {
  ...koHangKRPreset,
  hanja: koKoreVerticalPreset.hanja,
};

export function withDictionary(
  options: SeonbiOptions,
  dictionary: Record<string, string>,
): SeonbiOptions {
  if (options.hanja == null || Object.keys(dictionary).length === 0)
    return options;
  return {
    ...options,
    hanja: {
      ...options.hanja,
      reading: {
        ...options.hanja.reading,
        dictionary: { ...options.hanja.reading.dictionary, ...dictionary },
      },
    },
  };
}

export async function transform(
  content: string,
  options: SeonbiOptions,
): Promise<string> {
  const apiUrl = process.env.SEONBI_API_URL ?? "http://127.0.0.1:3800/";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ content, ...options }),
  });
  const result = (await response.json()) as {
    success?: boolean;
    content?: string;
    message?: string;
    warnings?: string[];
  };
  for (const warning of result.warnings ?? []) console.warn(warning);
  if (!response.ok || !result.success || result.content == null) {
    throw new Error(
      result.message ?? `Seonbi returned HTTP ${response.status}`,
    );
  }
  return result.content;
}
