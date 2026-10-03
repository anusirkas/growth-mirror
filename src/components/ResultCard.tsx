import { Paperclip } from "lucide-react";
import ThemeTag from "./ThemeTag";
import type { ReflectionResponse } from "../types";

type ResultCardProps = {
  response: ReflectionResponse;
  /** Extra content under the practical step, e.g. the follow-through toggle. */
  footer?: React.ReactNode;
};

const FALLBACK_REASON: Record<NonNullable<ReflectionResponse["reason"]>, string> = {
  "not-configured": "the AI isn't connected here",
  "rate-limited": "several reflections were sent in a few minutes",
  "ai-error": "the AI couldn't be reached",
  "invalid-ai-output": "the AI's answer didn't pass validation",
  timeout: "the AI took too long",
};

const SECTIONS = [
  { key: "progressSpotted", title: "Progress spotted" },
  { key: "biggestGap", title: "Biggest gap" },
  { key: "nextWeekFocus", title: "Next week's focus" },
] as const;

export default function ResultCard({ response, footer }: ResultCardProps) {
  const { result, source, reason, model } = response;

  return (
    <article className="reflection" aria-live="polite">
      <Paperclip className="clip" size={44} strokeWidth={1.6} aria-hidden="true" />
      <header className="reflection-head">
        <p className="label">Reflection</p>
        <ThemeTag theme={result.theme} />
      </header>

      {SECTIONS.map((s) => (
        <section key={s.key} className="note">
          <h3>{s.title}</h3>
          <p>{result[s.key]}</p>
        </section>
      ))}

      <section className="note step sticky">
        <span className="tape" aria-hidden="true" />
        <h3>Your next step</h3>
        <p>{result.practicalNextStep}</p>
        {footer}
      </section>

      <p className={`source source-${source}`}>
        {source === "gemini"
          ? model === "Example entry"
            ? "Example entry."
            : `Written by ${model ?? "Gemini"} from your answers, checked against a schema before showing it.`
          : `Rule-based reflection: ${reason ? FALLBACK_REASON[reason] : "the AI is unavailable"}, so this came from keyword scoring.`}
      </p>
    </article>
  );
}
