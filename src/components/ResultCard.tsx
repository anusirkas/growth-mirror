import type { ReflectionResponse, Theme } from "../types";
import Section from "./Section";

type ResultCardProps = {
  response: ReflectionResponse | null;
};

const THEME_LABEL: Record<Theme, string> = {
  focus: "Pattern: scattered focus",
  technical: "Pattern: technical growth",
  confidence: "Pattern: confidence",
  momentum: "Pattern: building momentum",
};

const FALLBACK_REASON: Record<NonNullable<ReflectionResponse["reason"]>, string> = {
  "not-configured": "the AI isn't connected here",
  "rate-limited": "several reflections were sent in a few minutes",
  "ai-error": "the AI couldn't be reached",
  "invalid-ai-output": "the AI's answer didn't pass validation",
  timeout: "the AI took too long",
};

export default function ResultCard({ response }: ResultCardProps) {
  if (!response) return null;
  const { result, source, reason, model } = response;

  return (
    <div className="card result-card" aria-live="polite">
      <div className="result-header">
        <div className="result-meta">
          <p className="result-badge">Weekly reflection summary</p>
          <p className="theme-chip">{THEME_LABEL[result.theme]}</p>
        </div>
        <h2>Your Growth Reflection</h2>
        <p className="result-intro">A clearer view of your progress, blind spots, and next step.</p>
      </div>

      <Section title="Progress Spotted" icon="↗">
        <p>{result.progressSpotted}</p>
      </Section>

      <Section title="Biggest Gap" icon="⚠">
        <p>{result.biggestGap}</p>
      </Section>

      <Section title="Next Week Focus" icon="→">
        <p>{result.nextWeekFocus}</p>
      </Section>

      <Section title="Practical Next Step" icon="✓">
        <p>{result.practicalNextStep}</p>
      </Section>

      <p className={`source-note source-${source}`}>
        {source === "gemini"
          ? `Written by ${model ?? "Gemini"} from your answers, then checked against a schema before showing it.`
          : `Rule-based reflection: ${reason ? FALLBACK_REASON[reason] : "the AI is unavailable"}, so this came from keyword scoring instead.`}
      </p>
    </div>
  );
}
