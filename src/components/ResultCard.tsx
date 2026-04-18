import type { ReflectionResult } from "../types";
import Section from "./Section";

type ResultCardProps = {
  result: ReflectionResult | null;
};

export default function ResultCard({ result }: ResultCardProps) {
  if (!result) return null;

  return (
    <div className="card result-card">
      <div className="result-header">
        <p className="result-badge">Weekly reflection summary</p>
        <h2>Your Growth Reflection</h2>
        <p className="result-intro">
          A clearer view of your progress, blind spots, and next step.
        </p>
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
    </div>
  );
}