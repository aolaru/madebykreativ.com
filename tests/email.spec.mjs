import { test, expect } from "@playwright/test";
import { publicEmailLinks } from "../scripts/public-email.mjs";
import { site } from "../src/data/site";

const routes = [
  "/contact/",
  "/services/",
  "/services/wordpress/",
  "/services/qa-api-testing/",
  "/about/",
  "/work/wordpress-link-reporting/",
  "/work/website-quality-checks/",
  "/apps/support/",
  "/privacy/",
  "/privacy/blockshift/",
  "/privacy/northlight/",
  "/privacy/sharesafe/",
  "/privacy/photofeather/",
  "/privacy/kreativ-fancy-text/",
];

test("Public email exemptions survive the build on every contact surface", async ({
  request,
}) => {
  for (const path of routes) {
    const response = await request.get(path);
    expect(response.ok(), path).toBe(true);
    const links = publicEmailLinks(await response.text(), {
      requireExemption: true,
    });
    expect(links.length, path).toBeGreaterThan(0);
  }
});

test("Public contact links work without JavaScript on all contact surfaces", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    for (const path of routes) {
      await page.goto(`http://127.0.0.1:4339${path}`);
      const links = page.locator(`a[href^="mailto:${site.email}"]`);
      expect(await links.count(), path).toBeGreaterThan(0);
      let visible = 0;
      for (const link of await links.all()) {
        if (!(await link.isVisible())) continue;
        visible++;
        expect(new URL(await link.getAttribute("href")).pathname).toBe(
          site.email,
        );
      }
      expect(visible, path).toBeGreaterThan(0);
      await expect(
        page.locator('a[href*="/cdn-cgi/l/email-protection"]'),
      ).toHaveCount(0);
    }
    await page.goto("http://127.0.0.1:4339/contact/#project-inquiry");
    const tools = page.locator("#project-inquiry .inquiry-tools");
    await expect(
      tools.getByRole("link", { name: site.email, exact: true }),
    ).toBeVisible();
    await tools.getByText("Project brief template", { exact: true }).click();
    await expect(tools.locator("pre")).toContainText("Project type:");
  } finally {
    await context.close();
  }
});
