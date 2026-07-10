import type { Language } from "./languages";

const timeZone = "Asia/Seoul";

function parts(date: Date): { year: number; month: number; day: number } {
  const values = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
  return values as { year: number; month: number; day: number };
}

function hanidec(value: number): string {
  return value.toLocaleString("zh-Hant-CN-u-nu-hanidec", {
    useGrouping: false,
  });
}

export function yearInSeoul(date: Date): number {
  return parts(date).year;
}

export function formatYear(year: number, language: Language): string {
  if (language === "ko-Kore" || language === "ja") return `${hanidec(year)}年`;
  if (language === "ko-Hang-KR") return `${year}년`;
  return String(year);
}

export function formatMonthDay(date: Date, language: Language): string {
  const { month, day } = parts(date);
  if (language === "ko-Kore") return `${hanidec(month)}月 ${hanidec(day)}日`;
  if (language === "ja") return `${hanidec(month)}月${hanidec(day)}日`;
  if (language === "ko-Hang-KR") return `${month}월 ${day}일`;
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatFullDate(date: Date, language: Language): string {
  if (language === "ko-Kore") {
    return `${formatYear(yearInSeoul(date), language)} ${formatMonthDay(date, language)}`;
  }
  if (language === "ja") {
    return `${formatYear(yearInSeoul(date), language)}${formatMonthDay(date, language)}`;
  }
  return new Intl.DateTimeFormat(language, {
    timeZone,
    dateStyle: "long",
  }).format(date);
}
