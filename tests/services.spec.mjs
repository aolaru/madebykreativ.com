import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { appStoreHref } from "../public/app-attribution.mjs";
import { communityProjects } from "../src/data/site";
import { assetVersion } from "../src/data/assets.ts";
import {
  selectedServiceWork,
  services,
  formatServicePrice,
  projectInquiryHref,
} from "../src/data/services";

test("Services has scoped EUR pricing, real independent work and SEO metadata", async ({
  page,
  request,
}) => {
  await page.goto("/services/");
  await expect(page).toHaveTitle(
    "Software Development Services | Made by KREATIV",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://madebykreativ.com/services/",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://madebykreativ.com/og-services.png",
  );
  await expect(page.locator('.site-nav-link[aria-current="page"]')).toHaveText(
    "Services",
  );
  await expect(page.locator(".service-offering")).toHaveCount(5);
  for (const service of services) {
    const card = page.locator(`#${service.id}`);
    await expect(card.getByRole("heading", { level: 3 })).toHaveText(
      service.name,
    );
    for (const price of service.prices)
      await expect(card).toContainText(formatServicePrice(price.from));
  }
  await expect(page.locator("#android")).toContainText(
    "project-specific technical evaluation",
  );
  await expect(page.locator("[data-service-work]")).toHaveCount(0);
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) => nodes.map((node) => JSON.parse(node.textContent)));
  const catalogue = schemas.find((schema) => schema["@type"] === "ItemList");
  expect(catalogue.itemListElement).toHaveLength(5);
  expect(
    catalogue.itemListElement.every(
      (entry) => entry.item["@type"] === "Service",
    ),
  ).toBe(true);
  await page.goto("/work/");
  await expect(page.locator("#selected-work")).toContainText(
    "not commissioned client projects",
  );
  await expect(page.locator("[data-service-work]")).toHaveCount(8);
  for (const work of selectedServiceWork) {
    const card = page.locator(`[data-service-work="${work.id}"]`);
    await expect(card.getByRole("heading")).toHaveText(work.name);
    const expectedHref = work.appSlug
      ? appStoreHref(work.href, { page: "/work/", position: "portfolio" })
      : work.href;
    await expect(card.getByRole("link")).toHaveAttribute("href", expectedHref);
    await expect(card.getByRole("link")).toHaveAttribute("rel", "noopener");
  }
  expect(await (await request.get("/sitemap.xml")).text()).toContain(
    "<loc>https://madebykreativ.com/services/</loc>",
  );
  expect((await request.get("/og-services.png")).ok()).toBe(true);
});

test("Services bypasses stale unversioned CSS and JavaScript caches", async ({
  page,
}) => {
  const requested = [];
  const staleRequests = [];
  await page.route(/\/(style\.css|site\.js)(\?|$)/, async (route) => {
    const url = new URL(route.request().url());
    requested.push(url.pathname);
    if (!url.searchParams.has("v")) {
      staleRequests.push(url.pathname);
      await route.fulfill({
        contentType: url.pathname.endsWith("css")
          ? "text/css"
          : "text/javascript",
        body: "/* cached before Services was added */",
      });
    } else {
      const response = await route.fetch();
      expect(url.searchParams.get("v")).toBe(
        assetVersion(await response.body()),
      );
      await route.fulfill({ response });
    }
  });
  await page.goto("/services/");
  await expect(page.locator(".case-grid")).toHaveCSS("display", "grid");
  await expect(page.locator(".service-offerings")).toHaveCSS("display", "grid");
  await page.locator("#theme-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(requested.sort()).toEqual(["/site.js", "/style.css"]);
  expect(staleRequests).toEqual([]);
});

test("Service inquiry links share one path and retain direct email alternatives", async ({
  page,
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const noScript = await context.newPage();
    await noScript.goto("http://127.0.0.1:4339/services/");
    for (const link of await noScript
      .getByRole("link", { name: "Discuss Your Project", exact: true })
      .all())
      await expect(link).toHaveAttribute("href", "/contact/#project-inquiry");
    const href = new URL(projectInquiryHref);
    expect(href.protocol).toBe("mailto:");
    expect(href.pathname).toBe("info@madebykreativ.com");
    expect(href.searchParams.get("subject")).toBe(
      "Software Development Project Inquiry",
    );
    for (const field of [
      "Project type:",
      "Brief description:",
      "Required functionality:",
      "Approximate budget (EUR):",
      "Desired deadline:",
      "Relevant links:",
    ])
      expect(href.searchParams.get("body")).toContain(field);
    await expect(noScript.locator("form")).toHaveCount(0);
  } finally {
    await context.close();
  }
  await page.goto("/contact/#project-inquiry");
  await expect(
    page
      .locator("#project-inquiry")
      .getByRole("link", { name: "info@madebykreativ.com", exact: true }),
  ).toHaveAttribute("href", projectInquiryHref);
  await expect(
    page.getByRole("link", { name: "Prepare an app support report" }),
  ).toBeVisible();
  await expect(page.locator('a[href$="/issues"]')).toHaveCount(
    communityProjects.length,
  );
});

test("Products, professional experience and contributor handoffs remain distinct", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".home-system-feature")).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "View Services",
      exact: true,
    }),
  ).toHaveAttribute("href", "/services/");
  await expect(page.locator("#active-projects")).toBeVisible();
  await page.goto("/about/");
  await expect(page.locator("#professional-heading")).toHaveText(
    "Professional experience, practical software",
  );
  for (const text of [
    "15 years",
    "RestAssured",
    "Postman",
    "SQL",
    "Jenkins",
    "Astro",
  ])
    await expect(page.locator("main")).toContainText(text);
  for (const name of ["Findsera", "News Ledger"])
    await expect(page.locator(".about-public-grid")).toContainText(name);
  await expect(page.locator(".founder-copy")).toContainText(
    "I no longer maintain those projects",
  );
  await expect(page.locator("main")).not.toContainText(
    /semi.?retired|lost my job|European Commission/i,
  );
});

for (const width of [320, 768, 861, 1280]) {
  test(`Services fits ${width}px with accessible light and dark themes`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/services/");
    await page.evaluate(() => document.fonts.ready);
    for (const img of await page.locator('img[loading="lazy"]').all())
      await img.scrollIntoViewIfNeeded();
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
    for (const theme of ["light", "dark"]) {
      if (theme === "dark") await page.locator("#theme-toggle").click();
      await expect(page.locator(".service-offerings")).toHaveCSS(
        "display",
        "grid",
      );
      await expect(page.locator(".case-grid")).toHaveCSS("display", "grid");
      for (const image of await page.locator(".service-work-image img").all()) {
        const box = await image.boundingBox();
        expect(box.width).toBeLessThanOrEqual(width);
        expect(box.height).toBeLessThanOrEqual(210);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map((entry) => ({
          id: entry.id,
          targets: entry.nodes.map((node) => node.target),
        })),
      ).toEqual([]);
      if (width > 860) {
        const brand = await page.locator(".site-nav-brand").boundingBox();
        const menu = await page.locator(".site-nav-links").boundingBox();
        const actions = await page.locator(".site-nav-actions").boundingBox();
        expect(menu.x).toBeGreaterThanOrEqual(brand.x + brand.width);
        expect(actions.x).toBeGreaterThanOrEqual(menu.x + menu.width);
      }
      if (process.env.VISUAL_PROOF) {
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({
          path: `/tmp/kreativ-services-${width}-${theme}-viewport.png`,
        });
        await page.screenshot({
          path: `/tmp/kreativ-services-${width}-${theme}.png`,
          fullPage: true,
        });
      }
    }
  });
}

test("Changed entry-page screenshots", async ({ page }) => {
  test.skip(!process.env.VISUAL_PROOF, "Local visual review only");
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/about/", "/contact/"]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `/tmp/kreativ-services-entry-${path === "/" ? "home" : path.replaceAll("/", "")}-${width}.png`,
      });
    }
  }
});
