import type {
  ReflectionInput,
  ReflectionResult,
} from "../types";

function countMatches(
  text: string,
  keywords: string[]
): number {
  return keywords.reduce((score, keyword) => {
    return text.includes(keyword) ? score + 1 : score;
  }, 0);
}

export function generateReflection(
  data: ReflectionInput
): ReflectionResult {
  const combinedText = `
    ${data.workedOn}
    ${data.learned}
    ${data.difficult}
    ${data.avoided}
    ${data.improve}
  `.toLowerCase();

  const confidenceKeywords = [
    "confidence",
    "imposter",
    "self-doubt",
    "junior",
    "stuck",
    "uncertain",
    "afraid",
    "not enough",
  ];

  const techKeywords = [
    "javascript",
    "typescript",
    "react",
    "vue",
    "node",
    "frontend",
    "backend",
    "coding",
    "development",
    "figma",
    "design",
  ];

  const focusKeywords = [
    "focus",
    "interrupt",
    "too many",
    "priorit",
    "scattered",
    "overwhelmed",
    "deadline",
    "time",
    "urgent",
    "distraction",
  ];

  const confidenceScore = countMatches(
    combinedText,
    confidenceKeywords
  );

  const techScore = countMatches(
    combinedText,
    techKeywords
  );

  const focusScore = countMatches(
    combinedText,
    focusKeywords
  );

  const highestScore = Math.max(
    confidenceScore,
    techScore,
    focusScore
  );

  if (highestScore === 0) {
    return {
      progressSpotted:
        "You made meaningful progress by continuing to move forward despite uncertainty. Reflection itself is already part of strong long-term growth.",
      biggestGap:
        "The main challenge is turning busy work into visible strategic progress. Without clarity, effort can feel heavier than it needs to.",
      nextWeekFocus:
        "Choose one area where progress matters most right now and let that guide your weekly decisions.",
      practicalNextStep:
        "At the start of next week, define one concrete outcome that would make the week feel successful before the noise of daily work takes over.",
    };
  }

  if (focusScore === highestScore) {
    return {
      progressSpotted:
        "You are handling a high amount of responsibility and adapting across multiple priorities. The fact that you notice the problem already shows strong product awareness.",
      biggestGap:
        "The main blocker is scattered attention. Constant context switching reduces deep work and makes progress feel slower than it actually is.",
      nextWeekFocus:
        "Protect one high-leverage priority and let it become the anchor for your week instead of trying to optimize everything at once.",
      practicalNextStep:
        "Define one non-negotiable focus block this week and decide in advance what can be intentionally ignored during that time.",
    };
  }

  if (techScore === highestScore) {
    return {
      progressSpotted:
        "You are building real technical depth by connecting learning directly to practical work. This is much stronger than passive studying because skill grows through repeated use.",
      biggestGap:
        "The challenge is consistency. Learning happens, but without protected time, important technical growth can get pushed aside by urgent tasks.",
      nextWeekFocus:
        "Choose one technical theme for the week and use your real work to reinforce it instead of treating learning as something separate.",
      practicalNextStep:
        "Schedule one focused 90-minute session for deliberate learning and create one visible output from it, such as a mini feature, code note, or small refactor.",
    };
  }

  return {
    progressSpotted:
      "You are growing faster than you may recognize. Taking ownership in uncertain situations is already proof of professional growth, not a sign that you are behind.",
    biggestGap:
      "Your main blocker is confidence, not capability. Self-doubt can make progress feel smaller than it actually is and delay important decisions.",
    nextWeekFocus:
      "Focus on evidence instead of emotion. Look at what you have built, solved, and improved rather than how confident you felt while doing it.",
    practicalNextStep:
      "Write down three concrete wins from this week and one situation where you handled something better than your past self would have.",
  };
}