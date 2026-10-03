import type { ReflectionInput, ReflectionResult, Theme } from "../types";

export const FIELDS = ["workedOn", "learned", "difficult", "avoided", "improve"] as const;
export const MAX_FIELD_LENGTH = 1500;
const THEMES: Theme[] = ["focus", "technical", "confidence", "momentum"];
const MAX_OUTPUT_LENGTH = 700;

export type InputCheck = { ok: true; input: ReflectionInput } | { ok: false; error: string };

/** Validates and trims a reflection submitted by the browser. */
export function validateInput(body: unknown): InputCheck {
  if (!body || typeof body !== "object") return { ok: false, error: "Expected a JSON object." };
  const input = {} as ReflectionInput;
  for (const field of FIELDS) {
    const value = (body as Record<string, unknown>)[field];
    if (typeof value !== "string") return { ok: false, error: `Missing field: ${field}.` };
    const trimmed = value.trim();
    if (!trimmed) return { ok: false, error: `Please answer every question (${field} is empty).` };
    if (trimmed.length > MAX_FIELD_LENGTH) return { ok: false, error: `Answers are limited to ${MAX_FIELD_LENGTH} characters.` };
    input[field] = trimmed;
  }
  return { ok: true, input };
}

/**
 * Checks the model's JSON before it reaches the user. Anything missing,
 * empty, oddly long or with an unknown theme is rejected, so the caller can
 * fall back instead of showing a broken reflection.
 */
export function parseModelOutput(raw: unknown): ReflectionResult | null {
  let data = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const text = (key: string) => {
    const v = d[key];
    return typeof v === "string" && v.trim() && v.length <= MAX_OUTPUT_LENGTH ? v.trim() : null;
  };
  const theme = THEMES.includes(d.theme as Theme) ? (d.theme as Theme) : null;
  const progressSpotted = text("progressSpotted");
  const biggestGap = text("biggestGap");
  const nextWeekFocus = text("nextWeekFocus");
  const practicalNextStep = text("practicalNextStep");
  if (!theme || !progressSpotted || !biggestGap || !nextWeekFocus || !practicalNextStep) return null;
  return { theme, progressSpotted, biggestGap, nextWeekFocus, practicalNextStep };
}
