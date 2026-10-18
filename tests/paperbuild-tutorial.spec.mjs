import { test, expect } from "@playwright/test";

const route = "/news/photos-to-pdf-android-paperbuild/";
const dimensions = [[968, 1850], [968, 1930], [968, 1510], [968, 850], [968, 1500]];

test("PaperBuild tutorial has real screenshots, free/Pro scope and working app links", async ({ page }) => {
  await page.goto(route);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://madebykreativ.com${route}`);
  await expect(page.locator("h1")).toHaveText("How to turn photos into a PDF on Android with PaperBuild");
  await expect(page.locator(".tutorial-screenshot")).toHaveCount(5);
  for (const [index, figure] of (await page.locator(".tutorial-screenshot").all()).entries()) {
    const image = figure.locator("img");
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect(image).toHaveAttribute("width", String(dimensions[index][0]));
    await expect(image).toHaveAttribute("height", String(dimensions[index][1]));
    await expect(image).toHaveAttribute("srcset", /480\.webp 480w.*960\.webp 960w/);
    await expect(image).toHaveAttribute("alt", /.+/);
    await expect(figure.locator("a")).toHaveAttribute("href", await image.getAttribute("src"));
    await expect(figure.locator("figcaption")).not.toBeEmpty();
  }
  for (const phrase of ["up to 10 pages", "one-time Google Play purchase, not a subscription", "not OCR", "Uninstalling removes", "not saved in drafts or presets"]) {
    await expect(page.locator(".news-detail")).toContainText(phrase);
  }
  await expect(page.getByRole("link", {name: "PaperBuild privacy policy", exact: true})).toHaveAttribute("href", "https://github.com/aolaru/kreativ-mobile-apps/blob/main/paperbuild/PRIVACY_POLICY.md");
  const links = await page.locator('.news-detail a[href*="play.google.com"]').evaluateAll((nodes) => nodes.map((node) => node.href));
  expect(links).toHaveLength(2);
  for (const href of links) {
    const params = new URL(href).searchParams;
    expect(params.get("id")).toBe("com.kreativ.paperbuild");
    expect(params.get("utm_source")).toBe("madebykreativ");
    expect(params.get("utm_medium")).toBe("website");
    expect(params.get("utm_campaign")).toBe("paperbuild_photos_pdf_202610");
  }
  expect(links.map((href) => new URL(href).searchParams.get("utm_content"))).toEqual(["pdf_tutorial_intro", "pdf_tutorial_footer"]);
  await expect(page.locator(".article-next-step")).toContainText("Explore PaperBuild");
  await expect(page.locator('.article-next-step a[href="/product-to-profit/"]')).toHaveCount(0);
  await page.getByRole("link", { name: "PaperBuild app details", exact: true }).click();
  await expect(page).toHaveURL(/\/apps\/paperbuild\/$/);
  await page.getByRole("link", { name: /^Read the PaperBuild tutorial/ }).click();
  await expect(page).toHaveURL(new RegExp(`${route}$`));
});

test("PaperBuild tutorial appears in Updates, both RSS feeds and sitemap", async ({ page, request }) => {
  await page.goto("/updates/");
  await expect(page.getByRole("link", { name: "How to turn photos into a PDF on Android with PaperBuild", exact: true })).toBeVisible();
  for (const path of ["/updates/rss.xml", "/news/rss.xml", "/sitemap.xml"]) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain(`https://madebykreativ.com${route}`);
  }
});
