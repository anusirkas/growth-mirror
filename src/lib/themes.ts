import { CodeXml, MessageCircleQuestionMark, Target, TrendingUp, type LucideIcon } from "lucide-react";
import type { Theme } from "../types";

/** Marker colours and an icon for each pattern; colours flip for dark mode in CSS. */
export const THEMES: Record<Theme, { label: string; short: string; color: string; Icon: LucideIcon }> = {
  focus: { label: "Scattered focus", short: "Focus", color: "var(--theme-focus)", Icon: Target },
  technical: { label: "Technical growth", short: "Technical", color: "var(--theme-technical)", Icon: CodeXml },
  confidence: { label: "Confidence", short: "Confidence", color: "var(--theme-confidence)", Icon: MessageCircleQuestionMark },
  momentum: { label: "Building momentum", short: "Momentum", color: "var(--theme-momentum)", Icon: TrendingUp },
};
