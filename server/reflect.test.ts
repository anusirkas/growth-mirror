import { describe, expect, it, vi } from "vitest";
import type { ReflectionResponse } from "../src/types";
import { handleReflect } from "./reflect";

const answers = {
  workedOn: "Built a checkout flow with Stripe",
  learned: "How webhooks retry",
  difficult: "Too many interrupts at work",
  avoided: "Writing tests",
  improve: "Focus",
};

const aiText = JSON.stringify({
  theme: "focus",
  progressSpotted: "You shipped a payment flow end to end.",
  biggestGap: "Interrupts are eating your deep work.",
  nextWeekFocus: "Protect focus time for the checkout tests.",
  practicalNextStep: "Book two 90-minute blocks and write the webhook tests first.",
});
const aiReply = { text: aiText, model: "Gemini Test" };

const post = (body: unknown, ip = "1.2.3.4") =>
  new Request("http://localhost/api/reflect", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const read = async (res: Response) => (await res.json()) as ReflectionResponse & { error?: string };

describe("handleReflect", () => {
  it("returns the AI reflection when the model answers in shape", async () => {
    const generate = vi.fn().mockResolvedValue(aiReply);
    const res = await handleReflect(post(answers), { generate, hits: new Map() });
    const body = await read(res);
    expect(res.status).toBe(200);
    expect(body.source).toBe("gemini");
    expect(body.model).toBe("Gemini Test");
    expect(body.result.theme).toBe("focus");
    expect(generate).toHaveBeenCalledWith(expect.objectContaining({ avoided: "Writing tests" }), expect.any(AbortSignal));
  });

  it("rejects bad input before calling the model", async () => {
    const generate = vi.fn();
    expect((await handleReflect(post("{oops"), { generate, hits: new Map() })).status).toBe(400);
    expect((await handleReflect(post({ ...answers, learned: "" }), { generate, hits: new Map() })).status).toBe(400);
    expect((await handleReflect(new Request("http://localhost/api/reflect"), { generate, hits: new Map() })).status).toBe(405);
    expect(generate).not.toHaveBeenCalled();
  });

  it("falls back when no API key is configured", async () => {
    const body = await read(await handleReflect(post(answers), { generate: null }));
    expect(body).toMatchObject({ source: "fallback", reason: "not-configured" });
    expect(body.result.practicalNextStep).toBeTruthy();
  });

  it("falls back when the model fails or returns the wrong shape", async () => {
    const failing = vi.fn().mockRejectedValue(new Error("429 quota"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await read(await handleReflect(post(answers), { generate: failing, hits: new Map() }))).toMatchObject({ source: "fallback", reason: "ai-error" });
    errorSpy.mockRestore();

    const garbled = vi.fn().mockResolvedValue({ text: '{"theme":"focus"}', model: "Gemini Test" });
    expect(await read(await handleReflect(post(answers), { generate: garbled, hits: new Map() }))).toMatchObject({ source: "fallback", reason: "invalid-ai-output" });
  });

  it("falls back when the model is too slow", async () => {
    vi.useFakeTimers();
    const hanging = vi.fn((_input, signal: AbortSignal) => new Promise<never>((_, reject) => signal.addEventListener("abort", () => reject(new Error("aborted")))));
    const pending = handleReflect(post(answers), { generate: hanging, hits: new Map() });
    await vi.advanceTimersByTimeAsync(16_000);
    expect(await read(await pending)).toMatchObject({ source: "fallback", reason: "timeout" });
    vi.useRealTimers();
  });

  it("rate-limits by IP and answers with the fallback instead of an error", async () => {
    const generate = vi.fn().mockResolvedValue(aiReply);
    const hits = new Map<string, number[]>();
    const now = () => 1_000_000;
    for (let i = 0; i < 8; i++) await handleReflect(post(answers), { generate, hits, now });
    const ninth = await read(await handleReflect(post(answers), { generate, hits, now }));
    expect(ninth).toMatchObject({ source: "fallback", reason: "rate-limited" });
    expect(generate).toHaveBeenCalledTimes(8);

    const otherIp = await read(await handleReflect(post(answers, "5.6.7.8"), { generate, hits, now }));
    expect(otherIp.source).toBe("gemini");
  });
});
