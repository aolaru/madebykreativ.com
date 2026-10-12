import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

test("Capture final preview screenshots", async ({ page }) => {
  test.skip(!process.env.VISUAL_PROOF, "Local visual review only");
  await mkdir("/tmp/kreativ-proof-oct12", { recursive: true });
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [name, route] of [["updates", "/updates/"], ["builder", "/product-to-profit/workflow-product-builder/"], ["apps", "/apps/northlight/"], ["home", "/"]]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      for (const image of await page.locator('img[loading="lazy"]').all()) await image.scrollIntoViewIfNeeded();
      await expect.poll(() => page.locator("img").evaluateAll((images) => images.filter((image) => !image.complete || image.naturalWidth === 0).length)).toBe(0);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `/tmp/kreativ-proof-oct12/${name}-${width}.png`, fullPage: true });
      console.log(`${name} ${width}px: ${await page.evaluate(() => document.documentElement.scrollHeight)}px page height`);
    }
  }
});
