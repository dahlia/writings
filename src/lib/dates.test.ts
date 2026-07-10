import { describe, expect, test } from "vitest";
import { formatFullDate, formatMonthDay, yearInSeoul } from "./dates";

describe("Seoul date formatting", () => {
  const midnightInSeoul = new Date("2026-03-10T00:10:00+09:00");

  test("does not display the previous UTC day", () => {
    expect(formatFullDate(midnightInSeoul, "en")).toBe("March 10, 2026");
    expect(formatMonthDay(midnightInSeoul, "ko-Hang-KR")).toBe("3월 10일");
  });

  test("groups posts by the year in Seoul", () => {
    expect(yearInSeoul(new Date("2025-12-31T15:30:00Z"))).toBe(2026);
  });
});
