import { describe, expect, it } from "vitest";
import { byWeek, isoWeek, journalStats, shiftWeeks, weekLabel, weekStartOf, type Entry } from "./journal";

describe("weeks", () => {
  it("finds the Monday of any day", () => {
    expect(weekStartOf(new Date("2026-10-03T12:00:00Z"))).toBe("2026-09-28"); // Saturday
    expect(weekStartOf(new Date("2026-09-28T00:00:00Z"))).toBe("2026-09-28"); // Monday itself
    expect(weekStartOf(new Date("2026-10-04T23:00:00Z"))).toBe("2026-09-28"); // Sunday
  });

  it("numbers weeks the ISO way, including across new year", () => {
    expect(isoWeek("2026-09-28")).toBe(40);
    expect(isoWeek("2025-12-29")).toBe(1); // belongs to 2026
    expect(isoWeek("2027-01-04")).toBe(1);
  });

  it("labels and shifts weeks", () => {
    expect(weekLabel("2026-09-28")).toBe("Week 40 · 28 Sep – 4 Oct");
    expect(shiftWeeks("2026-09-28", -1)).toBe("2026-09-21");
  });
});

const entry = (weekStart: string, theme: Entry["response"]["result"]["theme"], followedThrough: boolean | null, createdAt = `${weekStart}T18:00:00Z`): Entry => ({
  id: `${weekStart}-${createdAt}`,
  weekStart,
  createdAt,
  followedThrough,
  input: { workedOn: "a", learned: "b", difficult: "c", avoided: "d", improve: "e" },
  response: { source: "fallback", result: { theme, progressSpotted: "p", biggestGap: "g", nextWeekFocus: "f", practicalNextStep: "s" } },
});

describe("journalStats", () => {
  it("counts themes and follow-through over answered weeks only", () => {
    const s = journalStats([entry("2026-09-14", "focus", true), entry("2026-09-21", "focus", false), entry("2026-09-28", "confidence", null)]);
    expect(s.mostCommon).toBe("focus");
    expect(s.themeCounts.focus).toBe(2);
    expect(s.followThrough).toBe(0.5);
    expect(s.answered).toBe(2);
  });

  it("handles an empty journal", () => {
    expect(journalStats([])).toMatchObject({ weeks: 0, mostCommon: null, followThrough: null });
  });
});

describe("byWeek", () => {
  it("keeps the latest reflection per week, newest week first", () => {
    const list = byWeek([
      entry("2026-09-21", "focus", null),
      entry("2026-09-28", "focus", null, "2026-09-29T08:00:00Z"),
      entry("2026-09-28", "technical", null, "2026-10-02T08:00:00Z"),
    ]);
    expect(list.map((e) => [e.weekStart, e.response.result.theme])).toEqual([
      ["2026-09-28", "technical"],
      ["2026-09-21", "focus"],
    ]);
  });
});
