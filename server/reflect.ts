import { parseModelOutput, validateInput } from "../src/lib/validate.js";
import type { ReflectionResponse } from "../src/types";
import { generateReflection } from "../src/utils/generateReflection.js";
import { createGeminiGenerator, type Generate } from "./gemini.js";

export const TIMEOUT_MS = 15_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;

type Deps = {
  /** null when no API key is configured: always use the rule-based reflection. */
  generate: Generate | null;
  now?: () => number;
  /** Per-instance request log for rate limiting. Serverless instances are short-lived, so this is best effort. */
  hits?: Map<string, number[]>;
};

const sharedHits = new Map<string, number[]>();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

function isRateLimited(key: string, now: number, hits: Map<string, number[]>) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

/**
 * POST /api/reflect. Always answers with a reflection: Gemini when it can,
 * the rule-based version when the AI is unconfigured, rate-limited, slow,
 * failing or returns something that doesn't match the schema.
 */
export async function handleReflect(request: Request, deps: Deps): Promise<Response> {
  if (request.method !== "POST") return json({ error: "Use POST." }, 405);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  const check = validateInput(body);
  if (!check.ok) return json({ error: check.error }, 400);
  const { input } = check;

  const fallback = (reason: NonNullable<ReflectionResponse["reason"]>) =>
    json({ result: generateReflection(input), source: "fallback", reason } satisfies ReflectionResponse);

  if (!deps.generate) return fallback("not-configured");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (isRateLimited(ip, (deps.now ?? Date.now)(), deps.hits ?? sharedHits)) return fallback("rate-limited");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const { text, model } = await deps.generate(input, controller.signal);
    const result = parseModelOutput(text);
    if (!result) return fallback("invalid-ai-output");
    return json({ result, source: "gemini", model } satisfies ReflectionResponse);
  } catch (err) {
    if (controller.signal.aborted) return fallback("timeout");
    console.error("Gemini request failed", err);
    return fallback("ai-error");
  } finally {
    clearTimeout(timer);
  }
}

/** Dependencies for the deployed function, read from the environment. */
export function defaultDeps(): Deps {
  const key = process.env.GEMINI_API_KEY;
  return { generate: key ? createGeminiGenerator(key) : null };
}
