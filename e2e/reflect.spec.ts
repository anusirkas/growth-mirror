import { expect, test, type Page } from "@playwright/test";

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

async function fillExampleAndSubmit(page: Page) {
  await page.goto("/#/");
  await page.getByRole("button", { name: "Fill in an example week" }).click();
  await expect(page.getByLabel("What did I work on this week?")).not.toHaveValue("");
  await page.getByRole("button", { name: "Reflect on my week →" }).click();
}

test.describe("reflecting", () => {
  test("shows the AI reflection, who wrote it, and saves it to the journal", async ({ page }) => {
    await page.route("**/api/reflect", (route) => route.fulfill({ json: aiResponse }));
    await fillExampleAndSubmit(page);

    const reflection = page.getByRole("article");
    await expect(reflection.getByText("Confidence", { exact: true })).toBeVisible();
    await expect(reflection.getByText("Book a 15-minute review before your next pull request.")).toBeVisible();
    await expect(reflection.getByText(/Written by Gemini Test/)).toBeVisible();

    await page.getByRole("link", { name: "Journal" }).click();
    await expect(page.locator(".entry").first()).toContainText("Book a 15-minute review");
  });

  test("falls back to the rule-based reflection when no AI key is set", async ({ page }) => {
    // real request to the dev server, which runs with GEMINI_API_KEY blanked
    await fillExampleAndSubmit(page);
    await expect(page.getByText(/Rule-based reflection: the AI isn't connected here/)).toBeVisible();
  });

  test("still answers when the API is unreachable", async ({ page }) => {
    await page.route("**/api/reflect", (route) => route.abort("connectionrefused"));
    await fillExampleAndSubmit(page);
    await expect(page.getByText(/Rule-based reflection: the AI couldn't be reached/)).toBeVisible();
    await expect(page.getByText("Your next step")).toBeVisible();
  });

  test("shows validation errors from the server", async ({ page }) => {
    await page.route("**/api/reflect", (route) => route.fulfill({ status: 400, json: { error: "Please answer every question." } }));
    await fillExampleAndSubmit(page);
    await expect(page.getByRole("alert")).toHaveText("Please answer every question.");
    await expect(page.getByRole("article")).toHaveCount(0);
  });

  test("the API rejects incomplete reflections", async ({ request }) => {
    const res = await request.post("/api/reflect", { data: { workedOn: "Things", learned: "", difficult: "x", avoided: "y", improve: "z" } });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toMatch(/answer every question/);
  });
});

test.describe("journal and progress", () => {
  test("a first visit shows example weeks that can be removed", async ({ page }) => {
    await page.goto("/#/history");
    await expect(page.locator(".entry")).toHaveCount(8);
    await page.getByRole("button", { name: "Remove examples" }).click();
    await expect(page.getByText("No weeks yet.")).toBeVisible();

    await page.getByRole("link", { name: "Progress" }).click();
    await expect(page.getByText("Your progress appears after your first reflection.")).toBeVisible();
  });

  test("marking last week's step as done updates follow-through", async ({ page }) => {
    await page.goto("/#/progress");
    // examples: 5 of 7 answered steps were done
    await expect(page.getByText("71%")).toBeVisible();

    await page.getByRole("link", { name: "This week" }).click();
    const lastStep = page.getByRole("complementary");
    await expect(lastStep.getByText("Last week you planned to")).toBeVisible();
    await lastStep.getByRole("button", { name: "Done" }).click();
    await expect(lastStep.getByRole("button", { name: "Done" })).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("link", { name: "Progress" }).click();
    await expect(page.getByText("75%")).toBeVisible(); // 6 of 8
  });

  test("a week can be opened from the timeline and deleted", async ({ page }) => {
    await page.goto("/#/progress");
    await page.locator(".timeline a").first().click();
    await expect(page).toHaveURL(/#\/history\/example-/);
    await expect(page.getByText("Example entry", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Delete this week" }).click();
    await expect(page).toHaveURL(/#\/history$/);
    await expect(page.locator(".entry")).toHaveCount(7);
  });
});

test("the theme toggle switches and is remembered", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/#/");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();
});
