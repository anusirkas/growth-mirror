export type ReflectionInput = {
  workedOn: string;
  learned: string;
  difficult: string;
  avoided: string;
  improve: string;
};

/** The dominant pattern behind a week, used for a label in the result. */
export type Theme = "focus" | "technical" | "confidence" | "momentum";

export type ReflectionResult = {
  theme: Theme;
  progressSpotted: string;
  biggestGap: string;
  nextWeekFocus: string;
  practicalNextStep: string;
};

/** What /api/reflect returns: the reflection and who wrote it. */
export type ReflectionResponse = {
  result: ReflectionResult;
  source: "gemini" | "fallback";
  /** Human-readable model name when the AI wrote it. */
  model?: string;
  /** Why the rule-based fallback was used, when it was. */
  reason?: "not-configured" | "rate-limited" | "ai-error" | "invalid-ai-output" | "timeout";
};
