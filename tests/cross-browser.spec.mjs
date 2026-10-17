import { test, expect } from "@playwright/test";

test("Skip navigation lands after the shared header", async ({
  page,
  browserName,
}) => {
  const macWebKit = browserName === "webkit" && process.platform === "darwin";
  await page.goto("/");
  // WebKit on macOS only tabs to links with Full Keyboard Access enabled.
  if (macWebKit) await page.locator(".skip-link").focus();
  else await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.keyboard.press(macWebKit ? "Alt+Tab" : "Tab");
  expect(
    await page.evaluate(() => Boolean(document.activeElement.closest("main"))),
  ).toBe(true);
  await expect(page.locator("main .site-nav, main footer")).toHaveCount(0);
});

test("Mobile menu closes with Escape, outside clicks and focus departure", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/apps/");
  const trigger = page.locator(".site-nav-mobile-menu summary");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-label", "Close navigation menu");
  await page.keyboard.press("Escape");
  await expect(page.locator(".site-nav-mobile-menu")).not.toHaveAttribute(
    "open",
    "",
  );
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator("h1").click({ position: { x: 1, y: 1 } });
  await expect(page.locator(".site-nav-mobile-menu")).not.toHaveAttribute(
    "open",
    "",
  );
  const theme = await page.locator("html").getAttribute("data-theme");
  await page.keyboard.press("t");
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
});

test("Sharing copies the canonical URL and announces success", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.copiedUrl = text;
        },
      },
    });
    window.events = [];
    window.plausible = (...args) => window.events.push(args);
  });
  await page.goto("/apps/?private=do-not-track-me#test");
  await page.locator("#share-button").click();
  await expect(page.locator("#page-feedback")).toHaveText("Page link copied.");
  expect(await page.evaluate(() => window.copiedUrl)).toBe(
    "https://madebykreativ.com/apps/",
  );
  expect(
    await page.evaluate(() => JSON.stringify(window.events)),
  ).not.toContain("do-not-track-me");
});

test("Share failures have visible feedback", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async () => {
        throw new Error("Unavailable");
      },
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Denied");
        },
      },
    });
  });
  await page.goto("/");
  await page.locator("#share-button").click();
  await expect(page.locator("#page-feedback")).toContainText("Could not copy");
});

test("Updates preserve filters and loading more moves focus into new entries", async ({
  page,
}) => {
  await page.goto("/updates/");
  await page.getByRole("searchbox").fill("refreshed for the October");
  await expect(page).toHaveURL(/q=refreshed/);
  await page.reload();
  await expect(page.getByRole("searchbox")).toHaveValue(
    "refreshed for the October",
  );
  await expect(page.locator("[data-updates-count]")).toHaveText(
    "Showing 1 of 1 update",
  );
  await page.getByRole("searchbox").fill("");
  await page.getByRole("button", { name: "Fix", exact: true }).click();
  await expect(page).toHaveURL(/kind=Fix/);
  await page.goBack();
  await expect(page.locator('[data-news-filter="all"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const id = await page.locator("[data-news-entry]").nth(12).getAttribute("id");
  await page.getByRole("button", { name: "Show older updates" }).press("Enter");
  await expect(page.locator(`[id="${id}"]`)).toBeFocused();
  await expect(page).toHaveURL(/page=2/);
  await page.reload();
  await expect(page.locator("[data-news-entry]:visible")).toHaveCount(24);
});

test("App support is preselected and mobile content fits", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/apps/support/?app=paperbuild");
  await expect(
    page.getByRole("combobox", { name: "App", exact: true }),
  ).toHaveValue("paperbuild");
  await expect(page.getByLabel("App version", { exact: true })).toBeEnabled();
  for (const path of [
    "/apps/paperbuild/",
    "/apps/kreativ-font/",
    "/product-to-profit/system/",
    "/updates/",
  ]) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
