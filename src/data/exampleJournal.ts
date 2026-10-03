import { shiftWeeks, type Entry } from "../lib/journal";
import type { Theme } from "../types";

type Week = {
  theme: Theme;
  followedThrough: boolean | null;
  input: Entry["input"];
  result: Omit<Entry["response"]["result"], "theme">;
};

/**
 * Eight weeks of a fictional junior developer, oldest first. It shows the
 * loop the app is built around: a pattern repeats, a next step is taken (or
 * not), and the pattern shifts.
 */
const WEEKS: Week[] = [
  {
    theme: "technical",
    followedThrough: true,
    input: {
      workedOn: "First tickets on the product listing page. Mostly CSS fixes and one small API change.",
      learned: "How our Vue components are structured and where the data comes from.",
      difficult: "Reading other people's code. Everything felt connected to everything.",
      avoided: "Asking how the build pipeline works.",
      improve: "Understand the codebase faster.",
    },
    result: {
      progressSpotted: "You shipped real changes in your first weeks, including an API change, which means you already trace data from the backend to the UI.",
      biggestGap: "You're trying to understand the whole codebase at once, which makes every file feel heavier than it is.",
      nextWeekFocus: "Learn one path end to end instead of the whole system.",
      practicalNextStep: "Pick one feature, the product filter, and follow a single request from the click to the database. Write down each file it touches.",
    },
  },
  {
    theme: "focus",
    followedThrough: false,
    input: {
      workedOn: "Filter bug, two urgent hotfixes, a lot of Slack and three meetings.",
      learned: "How URL parameters hold filter state.",
      difficult: "Getting back into the filter work after every interruption.",
      avoided: "Writing the tests for the filter.",
      improve: "Finish what I start.",
    },
    result: {
      progressSpotted: "You traced the filter end to end and understood URL state, exactly what last week's step aimed for.",
      biggestGap: "Interruptions decide your day. The hotfixes were real, but the filter work kept losing to whatever was loudest.",
      nextWeekFocus: "Protect time for one unfinished thing.",
      practicalNextStep: "Block two 90-minute mornings in your calendar and use the first one to write the filter tests.",
    },
  },
  {
    theme: "focus",
    followedThrough: true,
    input: {
      workedOn: "Same filter, plus helping a colleague with a release.",
      learned: "That I didn't block the time last week because I felt I'd be letting the team down.",
      difficult: "Saying no to small requests.",
      avoided: "The filter tests, again.",
      improve: "Actually block the time.",
    },
    result: {
      progressSpotted: "You noticed why last week's step didn't happen. That's the kind of honesty that makes the next attempt work.",
      biggestGap: "The tests have slipped for two weeks; they've become the thing you avoid rather than a task.",
      nextWeekFocus: "Make the tests small enough to start.",
      practicalNextStep: "Write just one test for the price filter on Monday morning, before opening Slack.",
    },
  },
  {
    theme: "confidence",
    followedThrough: true,
    input: {
      workedOn: "Filter tests are done. Started on the cart.",
      learned: "Testing async code with mocked APIs.",
      difficult: "A race condition in the cart. I wasn't sure I was looking in the right place.",
      avoided: "Asking a senior for help because I didn't want to look slow.",
      improve: "Ask earlier.",
    },
    result: {
      progressSpotted: "The tests you avoided for three weeks are written, and you learned async testing on the way.",
      biggestGap: "You treat asking for help as a sign of being slow, so you stay stuck longer than you need to.",
      nextWeekFocus: "Shorten the time between getting stuck and involving someone.",
      practicalNextStep: "Next time you're stuck for 45 minutes, post what you've tried in the team channel.",
    },
  },
  {
    theme: "technical",
    followedThrough: true,
    input: {
      workedOn: "Fixed the cart race condition with help from Maris. Reviewed my first PR.",
      learned: "Optimistic updates and why the server should own the cart total.",
      difficult: "Giving review comments to someone more senior.",
      avoided: "Nothing big.",
      improve: "Get better at state management.",
    },
    result: {
      progressSpotted: "Asking for help got the race condition fixed in a day, and you reviewed code for the first time.",
      biggestGap: "You understand the fix, but not yet the pattern behind it, so the next state bug will feel new again.",
      nextWeekFocus: "Turn this fix into knowledge you can reuse.",
      practicalNextStep: "Write a short note in the team wiki explaining the cart race and how optimistic updates avoid it.",
    },
  },
  {
    theme: "momentum",
    followedThrough: true,
    input: {
      workedOn: "Wiki note, a small checkout feature, sprint demo.",
      learned: "Explaining something forces me to understand it.",
      difficult: "Demoing in front of the whole team.",
      avoided: "Planning what to learn next.",
      improve: "Have a direction for the next months.",
    },
    result: {
      progressSpotted: "You presented your own work to the team and turned a fix into documentation other people use.",
      biggestGap: "Weeks are going well, but there's no direction connecting them yet.",
      nextWeekFocus: "Pick one skill to grow over the next two months.",
      practicalNextStep: "Ask your lead which skill would make you most useful to the team in six months, and note the answer.",
    },
  },
  {
    theme: "confidence",
    followedThrough: false,
    input: {
      workedOn: "Started a bigger task on payments. Lots of reading.",
      learned: "How Stripe webhooks retry and why handlers must be idempotent.",
      difficult: "Feeling out of my depth on payments.",
      avoided: "Breaking the task into smaller pieces.",
      improve: "Feel less overwhelmed.",
    },
    result: {
      progressSpotted: "You learned idempotency, a concept many developers only meet after a production incident.",
      biggestGap: "The task feels too big because it's still one block; overwhelm is a planning problem here, not a skill problem.",
      nextWeekFocus: "Make the payments task concrete.",
      practicalNextStep: "Split the payments work into tickets no bigger than a day each, and share the list with your lead.",
    },
  },
  {
    theme: "focus",
    followedThrough: null,
    input: {
      workedOn: "Webhook handler for payments, plus an urgent bug from support.",
      learned: "Splitting the task last week would have saved me two days.",
      difficult: "Switching between the webhook and the support bug.",
      avoided: "Splitting the task, still.",
      improve: "Plan before I start.",
    },
    result: {
      progressSpotted: "The webhook handler works, and you can see clearly what the missing plan cost you.",
      biggestGap: "Without small tickets, interruptions hit harder: you lose the thread of one huge task instead of one small one.",
      nextWeekFocus: "Plan first, then build.",
      practicalNextStep: "Spend the first hour of Monday splitting the rest of the payments work into day-sized tickets.",
    },
  },
];

/** Example entries ending the week before `currentWeek`. */
export function exampleJournal(currentWeek: string): Entry[] {
  return WEEKS.map((w, i) => {
    const weekStart = shiftWeeks(currentWeek, i - WEEKS.length);
    return {
      id: `example-${weekStart}`,
      weekStart,
      // written on the Sunday evening that closes the week
      createdAt: new Date(Date.parse(`${weekStart}T19:00:00Z`) + 6 * 86_400_000).toISOString(),
      followedThrough: w.followedThrough,
      example: true,
      input: w.input,
      response: { source: "gemini", model: "Example entry", result: { theme: w.theme, ...w.result } },
    };
  });
}
