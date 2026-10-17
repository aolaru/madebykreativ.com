import { test, expect } from "@playwright/test";

const route = "/news/offline-compass-android-northlight/";
const dimensions = [[976, 1680], [976, 810], [976, 850], [1080, 1130]];

test("Northlight tutorial has real screenshots, limitations and attributed Play links", async ({ page }) => {
  await page.goto(route);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://madebykreativ.com${route}`);
  await expect(page.locator("h1")).toHaveText("How to use an offline compass on Android with Northlight");
  await expect(page.locator(".tutorial-screenshot")).toHaveCount(4);
  const figures = await page.locator(".tutorial-screenshot").all();
  for (const [index, figure] of figures.entries()) {
    const image = figure.locator("img");
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img) => [img.complete, img.naturalWidth, img.naturalHeight])).toEqual([true, ...dimensions[index]]);
    await expect(figure.locator("a")).toHaveAttribute("href", await image.getAttribute("src"));
    await expect(image).toHaveAttribute("alt", /.+/);
    await expect(figure.locator("figcaption")).not.toBeEmpty();
  }
  await expect(page.locator(".news-detail")).toContainText("±84 m at 68 percent confidence");
  await expect(page.locator(".news-detail")).toContainText("magnetic north");
  await expect(page.locator(".news-detail")).toContainText("one-time Google Play purchase, not a subscription");
  const links = await page.locator('.news-detail a[href*="play.google.com"]').evaluateAll((nodes) => nodes.map((node) => node.href));
  expect(links).toHaveLength(2);
  for (const href of links) {
    const params = new URL(href).searchParams;
    expect(params.get("id")).toBe("com.kreativ.northlight");
    expect(params.get("utm_source")).toBe("madebykreativ");
    expect(params.get("utm_medium")).toBe("website");
    expect(params.get("utm_campaign")).toBe("northlight_offline_202610");
  }
  expect(links.map((href) => new URL(href).searchParams.get("utm_content"))).toEqual(["compass_tutorial_intro", "compass_tutorial_footer"]);
  await expect(page.locator(".article-next-step")).toContainText("Explore Northlight");
  await expect(page.locator('.article-next-step a[href="/product-to-profit/"]')).toHaveCount(0);
  await page.getByRole("link", { name: "Northlight app details", exact: true }).click();
  await expect(page).toHaveURL(/\/apps\/northlight\/$/);
  await expect(page.locator(".app-hero img.app-screen")).toHaveAttribute("height", "1920");
  await page.getByRole("link", { name: /^Read the Northlight tutorial/ }).click();
  await expect(page).toHaveURL(new RegExp(`${route}$`));
});

test("Northlight tutorial is discoverable in Updates, both RSS feeds and sitemap", async ({ page, request }) => {
  await page.goto("/updates/");
  await expect(page.getByRole("link", { name: "How to use an offline compass on Android with Northlight", exact: true })).toBeVisible();
  for (const path of ["/updates/rss.xml", "/news/rss.xml", "/sitemap.xml"]) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain(`https://madebykreativ.com${route}`);
  }
});
