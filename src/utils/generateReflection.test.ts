import { describe, expect, it } from "vitest";
import { generateReflection } from "./generateReflection";

const base = { workedOn: "", learned: "", difficult: "", avoided: "", improve: "" };

describe("generateReflection (rule-based fallback)", () => {
  it("picks the strongest pattern across all answers", () => {
    expect(generateReflection({ ...base, difficult: "too many urgent deadlines, constant interrupts" }).theme).toBe("focus");
    expect(generateReflection({ ...base, learned: "TypeScript generics and React hooks" }).theme).toBe("technical");
    expect(generateReflection({ ...base, difficult: "imposter syndrome, I feel stuck as a junior" }).theme).toBe("confidence");
  });

  it("falls back to momentum when nothing matches", () => {
    const r = generateReflection({ ...base, workedOn: "gardening" });
    expect(r.theme).toBe("momentum");
    expect(r.practicalNextStep).toBeTruthy();
  });
});
