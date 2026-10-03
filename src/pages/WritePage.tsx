import { useState } from "react";
import FollowThrough from "../components/FollowThrough";
import ReflectionForm from "../components/ReflectionForm";
import ResultCard from "../components/ResultCard";
import { href, useJournal } from "../lib/hooks";
import { addEntry, byWeek, shiftWeeks, weekLabel, weekStartOf, type Entry } from "../lib/journal";
import type { ReflectionInput, ReflectionResponse } from "../types";
import { generateReflection } from "../utils/generateReflection";

export default function WritePage() {
  const journal = useJournal();
  const [saved, setSaved] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const thisWeek = weekStartOf(new Date());
  const lastWeek = byWeek(journal).find((e) => e.weekStart === shiftWeeks(thisWeek, -1));

  async function handleReflection(data: ReflectionInput) {
    setIsLoading(true);
    setError(null);
    let response: ReflectionResponse;
    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }
      response = body as ReflectionResponse;
    } catch {
      // offline or the API is unreachable: still give the user a reflection
      response = { result: generateReflection(data), source: "fallback", reason: "ai-error" };
    }
    setSaved(addEntry({ weekStart: thisWeek, input: data, response }));
    setIsLoading(false);
  }

  return (
    <div className={`write ${saved ? "has-result" : ""}`}>
      <div className="write-intro">
        <h1>How did this week go?</h1>
        <p>Five questions, about ten minutes. You get back where you grew, what's slowing you down and one concrete step.</p>
      </div>

      {lastWeek && !saved && (
        <aside className="last-step">
          <p className="label">Last week you planned to</p>
          <p className="last-step-text">{lastWeek.response.result.practicalNextStep}</p>
          <FollowThrough entry={lastWeek} />
        </aside>
      )}

      <div className="spread">
        <ReflectionForm weekLabel={weekLabel(thisWeek)} onSubmit={handleReflection} isLoading={isLoading} error={error} />
        {saved && (
          <div className="spread-right">
            <ResultCard response={saved.response} />
            <p className="saved-note">
              Saved to your journal. <a href={href({ page: "progress" })}>See your progress →</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
