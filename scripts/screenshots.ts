/**
 * README screenshots from a running instance (defaults to the local dev server).
 *   npx tsx scripts/screenshots.ts [baseUrl]
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const base = process.argv[2] ?? "http://localhost:5174";
const out = "docs/screenshots";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const shot = async (name: string, fullPage = false) =>
  sharp(await page.screenshot({ fullPage })).webp({ quality: 82 }).toFile(`${out}/${name}.webp`);

await page.goto(`${base}/#/`);
await page.getByRole("button", { name: "Fill in an example week" }).click();
await page.getByRole("button", { name: "Reflect on my week →" }).click();
await page.getByRole("article").waitFor({ timeout: 40_000 });
await page.locator(".spread").evaluate((el) => el.scrollIntoView({ block: "start" }));
await shot("reflection");

await page.goto(`${base}/#/progress`);
await page.waitForTimeout(500);
await shot("progress", true);

await page.goto(`${base}/#/history`);
await page.waitForTimeout(500);
await shot("journal");

await browser.close();
console.log(`Saved to ${out}/`);
