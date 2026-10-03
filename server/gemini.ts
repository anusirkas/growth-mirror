import { ApiError, GoogleGenAI, ThinkingLevel } from "@google/genai";
import type { ReflectionInput } from "../src/types";
import { buildUserPrompt, RESPONSE_SCHEMA, SYSTEM_PROMPT } from "./prompt.js";

/**
 * Tried in order. Pinned versions rather than "-latest" so behaviour doesn't
 * change underneath the app; the lighter model is a backup for the free tier,
 * where busy periods return 503 or 429.
 */
export const MODELS = [
  { id: "gemini-3.8-flash", label: "Gemini 3.8 Flash" },
  { id: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash-Lite" },
] as const;

const RETRYABLE = new Set([429, 500, 503]);

export type Generated = { text: string | undefined; model: string };

/** Returns the model's raw text and which model wrote it, or throws. Validation happens in the caller. */
export type Generate = (input: ReflectionInput, signal: AbortSignal) => Promise<Generated>;

export function createGeminiGenerator(apiKey: string): Generate {
  const ai = new GoogleGenAI({ apiKey });
  return async (input, signal) => {
    let lastError: unknown;
    for (const model of MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: model.id,
          contents: buildUserPrompt(input),
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseJsonSchema: RESPONSE_SCHEMA,
            temperature: 0.6,
            // Gemini 3 thinks before answering and those tokens count towards the limit;
            // a weekly reflection needs little reasoning, so keep it low and leave room for the JSON
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            maxOutputTokens: 2048,
            abortSignal: signal,
          },
        });
        return { text: response.text, model: model.label };
      } catch (err) {
        lastError = err;
        // only a busy or overloaded model is worth retrying on the next one
        if (!(err instanceof ApiError && RETRYABLE.has(err.status)) || signal.aborted) throw err;
      }
    }
    throw lastError;
  };
}
