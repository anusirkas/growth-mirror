import type { ReflectionInput, ReflectionResponse, Theme } from "../types";

/** One week in the journal. Stored only in this browser. */
export type Entry = {
  id: string;
  /** Monday of the reflected week, YYYY-MM-DD. */
  weekStart: string;
  createdAt: string;
  input: ReflectionInput;
  response: ReflectionResponse;
  /** Did the user take the practical next step? null until they say. */
  followedThrough: boolean | null;
  /** Bundled demo entries, so a first visit has something to look at. */
  example?: boolean;
};

/* ---------- Weeks ---------- */

const DAY = 86_400_000;

const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Monday of the week containing `date`, as YYYY-MM-DD (UTC). */
export function weekStartOf(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const weekday = (d.getUTCDay() + 6) % 7; // Monday = 0
  return toIsoDate(new Date(d.getTime() - weekday * DAY));
}

/** ISO-8601 week number for a YYYY-MM-DD Monday. */
export function isoWeek(weekStart: string): number {
  const d = new Date(`${weekStart}T00:00:00Z`);
  const thursday = new Date(d.getTime() + 3 * DAY); // the week's Thursday decides its year
  const yearStart = Date.UTC(thursday.getUTCFullYear(), 0, 1);
  return Math.floor((thursday.getTime() - yearStart) / DAY / 7) + 1;
}

// fixed names: Intl month abbreviations vary between runtimes ("Sep" vs "Sept")
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = { format: (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}` };

/** "Week 40 · 28 Sep – 4 Oct" */
export function weekLabel(weekStart: string): string {
  const start = new Date(`${weekStart}T00:00:00Z`);
  const end = new Date(start.getTime() + 6 * DAY);
  return `Week ${isoWeek(weekStart)} · ${fmt.format(start)} – ${fmt.format(end)}`;
}

export function shiftWeeks(weekStart: string, weeks: number): string {
  return toIsoDate(new Date(new Date(`${weekStart}T00:00:00Z`).getTime() + weeks * 7 * DAY));
}

/* ---------- Insights ---------- */

export type Stats = {
  weeks: number;
  themeCounts: Record<Theme, number>;
  mostCommon: Theme | null;
  /** Share of answered "did you do it?" questions that were yes, 0..1, or null if none answered. */
  followThrough: number | null;
  answered: number;
};

export function journalStats(entries: Entry[]): Stats {
  const themeCounts: Record<Theme, number> = { focus: 0, technical: 0, confidence: 0, momentum: 0 };
  for (const e of entries) themeCounts[e.response.result.theme]++;
  const ranked = (Object.entries(themeCounts) as [Theme, number][]).sort((a, b) => b[1] - a[1]);
  const answered = entries.filter((e) => e.followedThrough !== null);
  return {
    weeks: entries.length,
    themeCounts,
    mostCommon: ranked[0][1] > 0 ? ranked[0][0] : null,
    followThrough: answered.length ? answered.filter((e) => e.followedThrough).length / answered.length : null,
    answered: answered.length,
  };
}

/** Newest week first; one entry per week, the latest reflection wins. */
export function byWeek(entries: Entry[]): Entry[] {
  const latest = new Map<string, Entry>();
  for (const e of entries) {
    const current = latest.get(e.weekStart);
    if (!current || e.createdAt > current.createdAt) latest.set(e.weekStart, e);
  }
  return [...latest.values()].sort((a, b) => b.weekStart.localeCompare(a.weekStart));
}

/* ---------- Storage (localStorage + subscribe for useSyncExternalStore) ---------- */

const KEY = "growth-mirror-journal-v1";
const listeners = new Set<() => void>();
let cache: Entry[] | null = null;
const EMPTY: Entry[] = [];

export function readJournal(): Entry[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "null") ?? EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

export const serverJournal = () => EMPTY;

function write(next: Entry[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: keep it in memory for this visit */
  }
  listeners.forEach((l) => l());
}

export function subscribeJournal(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function addEntry(entry: Omit<Entry, "id" | "createdAt" | "followedThrough">) {
  const created = { ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString(), followedThrough: null };
  write([...readJournal(), created]);
  return created;
}

export function setFollowedThrough(id: string, value: boolean | null) {
  write(readJournal().map((e) => (e.id === id ? { ...e, followedThrough: value } : e)));
}

export function removeEntry(id: string) {
  write(readJournal().filter((e) => e.id !== id));
}

export function replaceJournal(entries: Entry[]) {
  write(entries);
}
