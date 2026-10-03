import { expect, test } from "@playwright/test";

const aiResponse = {
  source: "gemini",
  model: "Gemini Test",
  result: {
    theme: "confidence",
    progressSpotted: "You shipped the filter and found the race condition.",
    biggestGap: "You treat asking for review as a weakness.",
    nextWeekFocus: "Bring a colleague in earlier.",
    practicalNextStep: "Book a 15-minute review before your next pull request.",
  },
};

async function fillExampleAndSubmit(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Fill in an example week" }).click();
  await expect(page.getByLabel("What did I work on this week?")).not.toHaveValue("");
  await page.getByRole("button", { name: "Reflect My Growth →" }).click();
}

test("shows the AI reflection and who wrote it", async ({ page }) => {
  await page.route("**/api/reflect", (route) => route.fulfill({ json: aiResponse }));
  await fillExampleAndSubmit(page);

  await expect(page.getByRole("heading", { name: "Your Growth Reflection" })).toBeVisible();
  await expect(page.getByText("Pattern: confidence")).toBeVisible();
  await expect(page.getByText("Book a 15-minute review before your next pull request.")).toBeVisible();
  await expect(page.getByText(/Written by Gemini Test/)).toBeVisible();
});

test("falls back to the rule-based reflection when no AI key is set", async ({ page }) => {
  // real request to the dev server, which runs with GEMINI_API_KEY blanked
  await fillExampleAndSubmit(page);
  await expect(page.getByRole("heading", { name: "Your Growth Reflection" })).toBeVisible();
  await expect(page.getByText(/Rule-based reflection: the AI isn't connected here/)).toBeVisible();
});

test("still answers when the API is unreachable", async ({ page }) => {
  await page.route("**/api/reflect", (route) => route.abort("connectionrefused"));
  await fillExampleAndSubmit(page);
  await expect(page.getByText(/Rule-based reflection: the AI couldn't be reached/)).toBeVisible();
  await expect(page.getByText("Practical Next Step")).toBeVisible();
});

test("shows validation errors from the server", async ({ page }) => {
  await page.route("**/api/reflect", (route) => route.fulfill({ status: 400, json: { error: "Please answer every question." } }));
  await fillExampleAndSubmit(page);
  await expect(page.getByRole("alert")).toHaveText("Please answer every question.");
  await expect(page.getByRole("heading", { name: "Your Growth Reflection" })).toHaveCount(0);
});

test("the API rejects incomplete reflections", async ({ request }) => {
  const res = await request.post("/api/reflect", { data: { workedOn: "Things", learned: "", difficult: "x", avoided: "y", improve: "z" } });
  expect(res.status()).toBe(400);
  expect((await res.json()).error).toMatch(/answer every question/);
});
