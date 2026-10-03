import { describe, expect, it } from "vitest";
import { MAX_FIELD_LENGTH, parseModelOutput, validateInput } from "./validate";

const answers = {
  workedOn: "  Built a checkout flow  ",
  learned: "Stripe webhooks",
  difficult: "Testing async code",
  avoided: "Writing docs",
  improve: "Focus",
};

describe("validateInput", () => {
  it("trims and accepts complete answers", () => {
    const r = validateInput(answers);
    expect(r).toEqual({ ok: true, input: { ...answers, workedOn: "Built a checkout flow" } });
  });

  it("rejects missing, empty and overly long answers", () => {
    expect(validateInput(null).ok).toBe(false);
    expect(validateInput({ ...answers, learned: undefined }).ok).toBe(false);
    expect(validateInput({ ...answers, avoided: "   " }).ok).toBe(false);
    expect(validateInput({ ...answers, improve: "x".repeat(MAX_FIELD_LENGTH + 1) }).ok).toBe(false);
  });
});

describe("parseModelOutput", () => {
  const good = {
    theme: "focus",
    progressSpotted: "You shipped the checkout.",
    biggestGap: "Context switching.",
    nextWeekFocus: "One priority.",
    practicalNextStep: "Block two mornings.",
  };

  it("accepts a JSON string or an object", () => {
    expect(parseModelOutput(JSON.stringify(good))).toEqual(good);
    expect(parseModelOutput(good)).toEqual(good);
  });

  it("rejects malformed or incomplete output", () => {
    expect(parseModelOutput("not json")).toBeNull();
    expect(parseModelOutput(undefined)).toBeNull();
    expect(parseModelOutput({ ...good, theme: "vibes" })).toBeNull();
    expect(parseModelOutput({ ...good, biggestGap: "" })).toBeNull();
    expect(parseModelOutput({ ...good, practicalNextStep: "x".repeat(2000) })).toBeNull();
  });
});
