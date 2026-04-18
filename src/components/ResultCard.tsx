import type { ReflectionResult } from "../types";
import Section from "./Section";

type ResultCardProps = {
  result: ReflectionResult | null;
};

export default function ResultCard({ result }: ResultCardProps) {
  if (!result) return null;

  return (
    <div className="card result-card">
      <h2>Your Growth Reflection</h2>

      <Section title="Progress Spotted">
        <p>{result.progressSpotted}</p>
      </Section>

      <Section title="Biggest Gap">
        <p>{result.biggestGap}</p>
      </Section>

      <Section title="Next Week Focus">
        <p>{result.nextWeekFocus}</p>
      </Section>

      <Section title="Practical Next Step">
        <p>{result.practicalNextStep}</p>
      </Section>
    </div>
  );
}