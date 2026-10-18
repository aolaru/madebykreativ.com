import { test, expect } from "@playwright/test";

const route = "/news/discover-fonts-android-kreativ-font/";
const dimensions = [[968, 1880], [968, 1150], [968, 1540], [968, 1550], [968, 540]];

test("Kreativ Font tutorial has real screenshots, licence limits and working app links", async ({ page }) => {
  await page.goto(route);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://madebykreativ.com${route}`);
  await expect(page.locator("h1")).toHaveText("How to discover fonts on Android with Kreativ Font");
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
  for (const phrase of ["not a phone-font installer", "own prices and licences", "Catalogue search requires internet", "not a live type tester", "clearing app storage or uninstalling removes"]) {
    await expect(page.locator(".news-detail")).toContainText(phrase);
  }
  await expect(page.getByRole("link", {name: "Android app privacy section", exact: true})).toHaveAttribute("href", "https://kreativfont.com/blog/terms-of-use-privacy-policy#android-app-privacy");
  const links = await page.locator('.news-detail a[href*="play.google.com"]').evaluateAll((nodes) => nodes.map((node) => node.href));
  expect(links).toHaveLength(2);
  for (const href of links) {
    const params = new URL(href).searchParams;
    expect(params.get("id")).toBe("com.kreativ.fontapp");
    expect(params.get("utm_source")).toBe("madebykreativ");
    expect(params.get("utm_medium")).toBe("website");
    expect(params.get("utm_campaign")).toBe("kreativfont_discovery_202610");
  }
  expect(links.map((href) => new URL(href).searchParams.get("utm_content"))).toEqual(["font_tutorial_intro", "font_tutorial_footer"]);
  await expect(page.locator(".article-next-step")).toContainText("Explore Kreativ Font");
  await expect(page.locator('.article-next-step a[href="/product-to-profit/"]')).toHaveCount(0);
  await page.getByRole("link", {name: "Kreativ Font app details", exact: true}).click();
  await expect(page).toHaveURL(/\/apps\/kreativ-font\/$/);
  await page.getByRole("link", {name: /^Read the Kreativ Font tutorial/}).click();
  await expect(page).toHaveURL(new RegExp(`${route}$`));
});

test("Kreativ Font tutorial appears in Updates, both RSS feeds and sitemap", async ({ page, request }) => {
  await page.goto("/updates/");
  await expect(page.getByRole("link", {name: "How to discover fonts on Android with Kreativ Font", exact: true})).toBeVisible();
  for (const path of ["/updates/rss.xml", "/news/rss.xml", "/sitemap.xml"]) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain(`https://madebykreativ.com${route}`);
  }
});
