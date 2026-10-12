import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { storefrontHref } from "../public/product-attribution.mjs";

const files = await readdir("dist", { recursive: true });
const routes = [];
for (const file of files.filter((file) => file.endsWith("index.html"))) {
  const html = await readFile(`dist/${file}`, "utf8");
  if (!html.includes('http-equiv="refresh"'))
    routes.push(`/${file.replace(/index\.html$/, "")}`);
}

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1280, height: 900 },
]) {
  for (const route of routes)
    test(`${viewport.width}px ${route}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
      ).toBe(true);
      // Scroll lazy images into view before asserting their decoded content.
      for (const image of await page.locator('img[loading="lazy"]').all())
        await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          page
            .locator("img")
            .evaluateAll(
              (images) =>
                images.filter((img) => !img.complete || img.naturalWidth === 0)
                  .length,
            ),
        )
        .toBe(0);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map((item) => ({
          id: item.id,
          nodes: item.nodes.map((node) => ({
            target: node.target,
            summary: node.failureSummary,
          })),
        })),
      ).toEqual([]);
      expect(errors).toEqual([]);
      await page.locator("#theme-toggle").click();
      const dark = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        dark.violations.map((item) => ({
          id: item.id,
          nodes: item.nodes.map((node) => ({
            target: node.target,
            summary: node.failureSummary,
          })),
        })),
      ).toEqual([]);
    });
}

test("Updates combines archives, filters, paginates, and preserves legacy links", async ({
  page,
}) => {
  await page.goto("/updates/");
  await expect(page.locator("[data-news-entry]:visible")).toHaveCount(12);
  await page.locator("[data-updates-more]").click();
  await expect(page.locator("[data-news-entry]:visible")).toHaveCount(24);
  await page.getByRole("searchbox").fill("refreshed for the October");
  await expect(page.locator("[data-news-entry]:visible")).toHaveCount(1);
  await expect(page.locator("[data-updates-count]")).toHaveText("1 updates");
  await page.getByRole("searchbox").fill("zzzznonexistent");
  await expect(page.locator("[data-news-empty-state]")).toBeVisible();
  await page.goto("/news/");
  await expect(page).toHaveURL(/\/updates\/$/);
});

test("Mobile comparison exposes every price and all five stages", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/product-to-profit/");
  await expect(page.locator(".ptp-stage-path li")).toHaveCount(5);
  for (const node of await page
    .locator(".ptp-table-price, .ptp-stage-path a")
    .all()) {
    const box = await node.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(391);
  }
});

test("Published free packages match release manifest and compatibility aliases", async () => {
  const releases = JSON.parse(
    await readFile("src/data/productReleases.json", "utf8"),
  );
  for (const [slug, alias] of [
    ["idea-library", "KREATIV_Idea_Library_v2_Upgrade.zip"],
    ["product-idea-scorecard", "KREATIV_Product_Idea_Scorecard_v1.1.zip"],
  ]) {
    const release = releases[slug];
    for (const name of [release.packageName, alias]) {
      const bytes = await readFile(`dist/downloads/product-to-profit/${name}`);
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(
        release.sha256,
      );
    }
  }
  for (const [slug, release] of Object.entries(releases)) {
    const html = await readFile(
      `dist/product-to-profit/${slug}/index.html`,
      "utf8",
    );
    expect(html).toContain(release.version);
    expect(html).toContain(release.released);
    for (const key of Object.keys(release.previews))
      expect(files).toContain(`product-to-profit/previews/${key}.webp`);
  }
});

test("Product attribution is anonymous and local preview loads no analytics", async ({
  page,
}) => {
  expect(storefrontHref("/product-to-profit/", {})).toBe("/product-to-profit/");
  await page.goto("/");
  const href = await page
    .locator("[data-product-cta]")
    .first()
    .getAttribute("href");
  expect(new URL(href).searchParams.get("utm_source")).toBe(
    "madebykreativ.com",
  );
  expect(
    await page
      .locator('script[src*="cloudflareinsights"],script[src*="plausible.io"]')
      .count(),
  ).toBe(0);
});
