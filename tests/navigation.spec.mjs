import { test, expect } from "@playwright/test";

const navigation = [
  ["Books", "/product-to-profit/", "/product-to-profit/idea-library/"],
  ["Websites", "/projects/", "/projects/kreativ-font/"],
  ["Apps", "/apps/", "/apps/sharesafe/"],
  ["Updates", "/updates/"],
  ["About", "/about/"],
  ["Contact", "/contact/"],
];

for (const width of [320, 1280]) {
  for (const [label, href, detail] of navigation.slice(0, 3)) {
    test(`${width}px navigation labels and active ${label} link`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(detail);
      const mobile = width < 768;
      if (mobile) await page.locator(".site-nav-mobile-menu summary").click();
      const menu = page.locator(
        mobile ? ".site-nav-mobile-panel" : ".site-nav-links",
      );
      await expect(menu).toBeVisible();
      await expect(menu.getByRole("link")).toHaveText(
        navigation.map(([name]) => name),
      );
      for (const [name, target] of navigation) {
        await expect(
          menu.getByRole("link", { name, exact: true }),
        ).toHaveAttribute("href", target);
      }
      await expect(menu.locator('[aria-current="page"]')).toHaveText(label);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (process.env.VISUAL_PROOF && label === "Books") {
        await page
          .locator(mobile ? ".site-nav-mobile-panel" : ".site-header")
          .screenshot({
            path: `/tmp/kreativ-navigation-${width}.png`,
          });
      }
      await menu.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      await expect(
        page.locator('.site-nav-link[aria-current="page"]'),
      ).toHaveText(label);
    });
  }
}
