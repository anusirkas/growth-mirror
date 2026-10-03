import type { Theme } from "../types";

/** Ink colours for each pattern, readable on paper in light and dark. */
export const THEMES: Record<Theme, { label: string; short: string; color: string }> = {
  focus: { label: "Scattered focus", short: "Focus", color: "var(--theme-focus)" },
  technical: { label: "Technical growth", short: "Technical", color: "var(--theme-technical)" },
  confidence: { label: "Confidence", short: "Confidence", color: "var(--theme-confidence)" },
  momentum: { label: "Building momentum", short: "Momentum", color: "var(--theme-momentum)" },
};
