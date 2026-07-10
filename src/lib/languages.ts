export const languages = ["en", "ko-Hang-KR", "ko-Kore", "ja"] as const;

export type Language = (typeof languages)[number];

export const languageFiles: Record<Language, string> = {
  en: "en",
  "ko-Hang-KR": "ko-hang-kr",
  "ko-Kore": "ko-kore",
  ja: "ja",
};

export const fileLanguages = Object.fromEntries(
  Object.entries(languageFiles).map(([language, file]) => [file, language]),
) as Record<string, Language>;

export function isLanguage(value: string): value is Language {
  return languages.includes(value as Language);
}
