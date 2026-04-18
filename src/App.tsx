import { useState } from "react";
import ReflectionForm from "./components/ReflectionForm";
import ResultCard from "./components/ResultCard";
import { generateReflection } from "./utils/generateReflection";
import type { ReflectionInput, ReflectionResult } from "./types";

export default function App() {
  const [result, setResult] = useState<ReflectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleReflection(data: ReflectionInput) {
    console.log("Reflection input:", data);

    setIsLoading(true);

    // Mock delay to simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const smartResult = generateReflection(data);
    setResult(smartResult);
    setIsLoading(false);
  }

  return (
    <main className={`app-shell ${result ? "has-result" : "no-result"}`}>
      <ReflectionForm onSubmit={handleReflection} isLoading={isLoading} />
      <ResultCard result={result} />
    </main>
  );
}