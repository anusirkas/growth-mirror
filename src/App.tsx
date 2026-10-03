import { useState } from "react";
import ReflectionForm from "./components/ReflectionForm";
import ResultCard from "./components/ResultCard";
import type { ReflectionInput, ReflectionResponse } from "./types";
import { generateReflection } from "./utils/generateReflection";

export default function App() {
  const [response, setResponse] = useState<ReflectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReflection(data: ReflectionInput) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      setResponse(body as ReflectionResponse);
    } catch {
      // offline or the API is unreachable: still give the user a reflection
      setResponse({ result: generateReflection(data), source: "fallback", reason: "ai-error" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={`app-shell ${response ? "has-result" : "no-result"}`}>
      <ReflectionForm onSubmit={handleReflection} isLoading={isLoading} error={error} />
      <ResultCard response={response} />
    </main>
  );
}
