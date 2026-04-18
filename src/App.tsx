import { useState } from "react";
import ReflectionForm from "./components/ReflectionForm";
import ResultCard from "./components/ResultCard";
import { mockResult } from "./data/mockResult";
import type { ReflectionInput, ReflectionResult } from "./types";

export default function App() {
  const [result, setResult] = useState<ReflectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleReflection(data: ReflectionInput) {
    console.log("Reflection input:", data);

    setIsLoading(true);

    // Mock delay to simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setResult(mockResult);
    setIsLoading(false);
  }

  return (
    <main className="app-shell">
      <ReflectionForm onSubmit={handleReflection} isLoading={isLoading} />
      <ResultCard result={result} />
    </main>
  );
}