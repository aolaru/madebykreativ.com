import { test, expect } from "@playwright/test";

const route = "/news/remove-photo-metadata-android-sharesafe/";

test("ShareSafe tutorial has five real screenshots and attributed Play links", async ({ page }) => {
  await page.goto(route);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://madebykreativ.com${route}`);
  await expect(page.locator("h1")).toHaveText("How to remove photo metadata on Android with ShareSafe");
  await expect(page.locator(".tutorial-screenshot")).toHaveCount(5);
  for (const figure of await page.locator(".tutorial-screenshot").all()) {
    const image = figure.locator("img");
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect(image).toHaveAttribute("width", "1080");
    await expect(image).toHaveAttribute("height", "2340");
    await expect(image).toHaveAttribute("srcset", /480\.webp 480w.*960\.webp 960w/);
    await expect(figure.locator("a")).toHaveAttribute("href", await image.getAttribute("src"));
    await expect(image).toHaveAttribute("alt", /.+/);
    await expect(figure.locator("figcaption")).not.toBeEmpty();
  }
  const links = await page.locator('.news-detail a[href*="play.google.com"]').evaluateAll((nodes) => nodes.map((node) => node.href));
  expect(links).toHaveLength(2);
  for (const href of links) {
    const params = new URL(href).searchParams;
    expect(params.get("id")).toBe("com.kreativ.sharesafe");
    expect(params.get("utm_source")).toBe("madebykreativ");
    expect(params.get("utm_medium")).toBe("website");
    expect(params.get("utm_campaign")).toBe("sharesafe_privacy_202610");
  }
  expect(links.map((href) => new URL(href).searchParams.get("utm_content"))).toEqual(["metadata_tutorial_intro", "metadata_tutorial_footer"]);
  await expect(page.locator(".article-next-step")).toContainText("Explore ShareSafe");
  await expect(page.locator('.article-next-step a[href="/product-to-profit/"]')).toHaveCount(0);
  await page.getByRole("link", { name: "ShareSafe app details", exact: true }).click();
  await expect(page).toHaveURL(/\/apps\/sharesafe\/$/);
  await page.getByRole("link", { name: /^Read the ShareSafe tutorial/ }).click();
  await expect(page).toHaveURL(new RegExp(`${route}$`));
});

test("ShareSafe tutorial is discoverable in Updates, RSS and the sitemap", async ({ page, request }) => {
  await page.goto("/updates/");
  await expect(page.getByRole("link", { name: "How to remove photo metadata on Android with ShareSafe", exact: true })).toBeVisible();
  for (const path of ["/updates/rss.xml", "/sitemap.xml"]) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain(`https://madebykreativ.com${route}`);
  }
});
