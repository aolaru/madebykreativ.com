import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { apps } from "../src/data/apps";

test("Apps directory has published store links, pricing, and working detail pages", async ({
  page,
}) => {
  await page.goto("/apps/");
  await expect(page).toHaveTitle("Kreativ Apps | Made by Kreativ");
  await expect(page.locator('.site-nav-link[aria-current="page"]')).toHaveText(
    "Apps",
  );
  await expect(page.locator(".apps-card")).toHaveCount(apps.length);
  await expect(page.locator(".apps-platform")).toHaveText(
    apps.flatMap((app) => [
      ...new Set(app.stores.map((store) => store.platform)),
    ]),
  );
  for (const app of apps) {
    const { slug } = app;
    const card = page.locator(`article[aria-labelledby="${slug}-heading"]`);
    await expect(card).toContainText(app.accessLabel);
    for (const store of app.stores) {
      await expect(
        card.getByRole("link", { name: `Get it on ${store.name}` }),
      ).toHaveAttribute("href", store.url);
    }
    await expect(
      card.getByRole("link", { name: "Privacy policy" }),
    ).toHaveAttribute("href", `/privacy/${slug}/`);
    await card.getByRole("link", { name: /^App details/ }).click();
    await expect(page).toHaveURL(new RegExp(`/apps/${slug}/$`));
    await expect(
      page
        .getByRole("navigation", { name: "Breadcrumb", exact: true })
        .getByRole("link", { name: "Apps", exact: true }),
    ).toHaveAttribute("href", "/apps/");
    await expect(
      page.locator('.site-nav-link[aria-current="page"]'),
    ).toHaveText("Apps");
    await page.goto("/apps/");
  }
  await expect(page.locator('a[href*="apps.apple.com"]')).toHaveCount(
    apps
      .flatMap((app) => app.stores)
      .filter((store) => store.name === "App Store").length,
  );
});

test("Homepage links to Apps and the mobile menu highlights the directory", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: /^View all apps/ }).click();
  await expect(page).toHaveURL(/\/apps\/$/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".site-nav-mobile-menu summary").click();
  await expect(
    page.locator('.site-nav-mobile-panel a[aria-current="page"]'),
  ).toHaveText("Apps");
});

test("App store links remain available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4339/apps/");
    await expect(page.locator(".apps-card-actions a.button-cta")).toHaveCount(
      apps.flatMap((app) => app.stores).length,
    );
    await expect(page.getByRole("link", { name: /^App details/ })).toHaveCount(
      apps.length,
    );
  } finally {
    await context.close();
  }
});

test("Apps catalogue screenshots", async ({ page }) => {
  test.skip(!process.env.VISUAL_PROOF, "Local visual review only");
  await mkdir("/tmp/kreativ-apps-oct15", { recursive: true });
  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/apps/");
    await page.evaluate(() => document.fonts.ready);
    for (const image of await page.locator(".apps-card-preview img").all())
      await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        page
          .locator("img")
          .evaluateAll(
            (images) =>
              images.filter(
                (image) => !image.complete || image.naturalWidth === 0,
              ).length,
          ),
      )
      .toBe(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `/tmp/kreativ-apps-oct15/apps-${width}.png`,
      fullPage: true,
    });
    await page.locator("#theme-toggle").click();
    await page.evaluate(async () => {
      await Promise.all(
        document
          .getAnimations()
          .map((animation) => animation.finished.catch(() => {})),
      );
    });
    await page.screenshot({
      path: `/tmp/kreativ-apps-oct15/apps-${width}-dark.png`,
      fullPage: true,
    });
    await page.locator("#theme-toggle").click();
  }
});
