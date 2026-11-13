import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  engagementPackages,
  serviceLandingPages,
} from "../src/data/engagements";
import { caseStudies, qaSample } from "../src/data/caseStudies";
import { formatServicePrice, projectInquiryHref } from "../src/data/services";
import { activeProjects, communityProjects } from "../src/data/site";

test("Kreativ Tools replaces Auto as an active owner-maintained project", async ({
  page,
}) => {
  expect(activeProjects.map((project) => project.slug)).toEqual([
    "kreativ-font",
    "kreativ-sound",
    "kreativ-wp",
    "kreativ-tools",
  ]);
  expect(communityProjects.map((project) => project.slug)).toEqual([
    "find-sera",
    "signal-ledger",
  ]);
  await page.goto("/");
  await expect(
    page
      .locator("#active-projects")
      .getByRole("link", { name: "Kreativ Tools", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator("#active-projects")
      .getByRole("link", { name: "Kreativ Auto", exact: true }),
  ).toHaveCount(0);
  await page.goto("/projects/");
  await expect(page.locator(".project-directory-grid-public")).toContainText(
    "Kreativ Tools",
  );
  await expect(
    page.locator(".project-directory-grid-public"),
  ).not.toContainText("Kreativ Auto");
  await page.goto("/projects/kreativ-tools/");
  await expect(page.locator(".project-hero-actions .meta-note")).toContainText(
    "Active",
  );
  await expect(page.locator(".project-evidence")).toContainText(
    "Actively maintained by Andrei",
  );
  await expect(
    page.getByRole("link", { name: "View source code", exact: true }).first(),
  ).toHaveAttribute("href", "https://github.com/aolaru/kreativtools");
  await page.goto("/projects/kreativ-auto/");
  await expect(page.locator(".project-hero-actions .meta-note")).toContainText(
    "Paused",
  );
  await page.goto("/about/");
  await expect(page.locator(".about-public-grid")).not.toContainText(
    "Kreativ Tools",
  );
  await expect(page.locator(".about-public-grid")).toContainText("Findsera");
  await expect(page.locator(".about-public-grid")).toContainText("News Ledger");
  await page.goto("/news/maintenance-open-source-transition/");
  await expect(page.locator(".article-archive-note")).toBeVisible();
  await expect(page.locator(".news-detail")).toContainText("Kreativ Tools");
});

test("Homepage leads with hiring and keeps resources secondary", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Software Development & QA | Made by KREATIV");
  const hero = page.locator(".client-home-hero");
  await expect(hero.getByRole("heading", { level: 1 })).toHaveText(
    "Made by Kreativ",
  );
  await expect(hero).toContainText("Custom software. Built and tested.");
  await expect(
    hero.getByRole("link", { name: "Discuss Your Project" }),
  ).toHaveAttribute("href", "/contact/#project-inquiry");
  await expect(
    hero.locator('a[href*="gumroad"],a[href*="product-to-profit"]'),
  ).toHaveCount(0);
  const packages = page.locator(".engagement-grid-compact");
  await expect(packages.locator(".engagement")).toHaveCount(3);
  for (const item of engagementPackages)
    await expect(
      packages.locator(`[data-package="${item.id}"]`).first(),
    ).toContainText(formatServicePrice(item.from));
  const resources = page.locator(".client-products");
  expect((await resources.boundingBox()).y).toBeGreaterThan(
    (await packages.boundingBox()).y,
  );
  await expect(
    resources.getByRole("link", { name: "View all apps" }),
  ).toHaveAttribute("href", "/apps/");
  await expect(
    resources.getByRole("link", { name: "Browse books and workbooks" }),
  ).toHaveAttribute("href", "/product-to-profit/");
  for (const article of await resources.locator("article").all()) {
    const frame = await article.locator(".client-product-image").boundingBox();
    const image = await article.locator("img").boundingBox();
    expect(image.height).toBeLessThanOrEqual(frame.height + 1);
  }
  await expect(page.locator(".site-nav-links").getByRole("link")).toHaveText([
    "Services",
    "Work",
    "About",
    "Contact",
  ]);
});

test("Focused offers, evidence and service articles are connected and indexed", async ({
  page,
  request,
}) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const service of serviceLandingPages) {
    const path = `/services/${service.slug}/`;
    await page.goto(path);
    await expect(page.locator("h1")).toHaveText(service.title);
    await expect(
      page.locator('.site-nav-link[aria-current="page"]'),
    ).toHaveText("Services");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://madebykreativ.com${path}`,
    );
    await expect(
      page.getByRole("heading", { name: "What you receive" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "What to bring" }),
    ).toBeVisible();
    expect(sitemap).toContain(`<loc>https://madebykreativ.com${path}</loc>`);
    await page.goto(`/news/${service.article}/`);
    await expect(
      page
        .locator(".article-next-step")
        .getByRole("link", { name: "Service scope and packages" }),
    ).toHaveAttribute("href", path);
    for (const feed of ["/updates/rss.xml", "/news/rss.xml"])
      expect(await (await request.get(feed)).text()).toContain(service.article);
  }
  for (const study of caseStudies) {
    await page.goto(`/work/${study.slug}/`);
    await expect(
      page.getByRole("heading", { name: "My contribution", exact: true }),
    ).toBeVisible();
    await expect(page.locator("main")).toContainText(
      study.slug === "api-automation-demo"
        ? "synthetic demonstration"
        : study.slug === "website-quality-checks"
          ? "not confidential enterprise or client work"
          : "not a commissioned client project",
    );
    await expect(
      page.getByRole("heading", { name: "Implementation decisions" }),
    ).toBeVisible();
    expect(sitemap).toContain(
      `<loc>https://madebykreativ.com/work/${study.slug}/</loc>`,
    );
  }
  const report = await request.get("/work/website-quality-checks/report.json");
  expect(report.ok()).toBe(true);
  expect(await report.json()).toEqual(qaSample);
});

test("Project brief validation, email draft and clipboard keep visitor data local", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__inquiryEvents = [];
    window.plausible = (name, options) =>
      window.__inquiryEvents.push({ name, props: options.props });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.__copiedBrief = text;
        },
      },
    });
  });
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/contact/?service=wordpress-repair#project-inquiry");
  const form = page.locator("[data-project-inquiry]");
  await expect(form).toBeVisible();
  await expect(page.getByLabel("Project type", { exact: true })).toHaveValue(
    "wordpress-repair",
  );
  await page.getByRole("button", { name: "Prepare Email Instead" }).click();
  await expect(page.locator("[data-project-draft]")).toBeHidden();
  await page.getByLabel("What needs building or fixing?").fill("   ");
  await page.getByRole("button", { name: "Prepare Email Instead" }).click();
  await expect(page.locator("[data-project-draft]")).toBeHidden();
  const summary =
    "PRIVATE-BRIEF-EXAMPLE: exported rows do not match the selected filter <script>bad()</script>";
  await page.getByLabel("What needs building or fixing?").fill(summary);
  await page
    .getByLabel("Required functionality (optional)")
    .fill("Keep the filter when exporting CSV.");
  await page.getByLabel("Approximate budget (EUR, optional)").fill("650");
  await page.getByLabel("Desired deadline (optional)").fill("2026-12-15");
  await page
    .getByLabel("Relevant public link (optional)")
    .fill("https://example.com/public-demo");
  await page.getByRole("button", { name: "Prepare Email Instead" }).click();
  await expect(page.locator("[data-project-draft]")).toBeVisible();
  const draft = await page
    .getByLabel("Email draft", { exact: true })
    .inputValue();
  expect(draft).toContain(summary);
  expect(draft).toContain("Approximate budget (EUR): 650");
  expect(draft).toContain("Desired deadline: 2026-12-15");
  const mail = new URL(
    await page
      .getByRole("link", { name: "Open Email Draft", exact: true })
      .getAttribute("href"),
  );
  expect(mail.protocol).toBe("mailto:");
  expect(mail.pathname).toBe("info@madebykreativ.com");
  expect(mail.searchParams.get("body")).toBe(draft);
  await expect(page.locator("#draft-heading")).toBeFocused();
  await page
    .getByRole("button", { name: "Copy completed project brief", exact: true })
    .click();
  expect(await page.evaluate(() => window.__copiedBrief)).toBe(draft);
  expect(
    await page.evaluate(
      () =>
        Object.values(localStorage).join(" ") +
        Object.values(sessionStorage).join(" "),
    ),
  ).not.toContain("PRIVATE-BRIEF-EXAMPLE");
  expect(
    requests.some(
      (url) =>
        url.includes("PRIVATE-BRIEF-EXAMPLE") || url.includes("public-demo"),
    ),
  ).toBe(false);
  expect(await page.evaluate(() => window.__inquiryEvents)).toContainEqual({
    name: "Project Brief Prepared",
    props: { service: "wordpress-repair", page: "/contact/" },
  });
  expect(
    JSON.stringify(await page.evaluate(() => window.__inquiryEvents)),
  ).not.toContain("PRIVATE-BRIEF-EXAMPLE");
  await page
    .getByLabel("What needs building or fixing?")
    .fill("A different issue");
  await expect(page.locator("[data-project-draft]")).toBeHidden();
});

test("Clipboard failures and invalid package URLs have useful fallbacks", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Unavailable");
        },
      },
    }),
  );
  await page.goto("/contact/?service=not-a-package&summary=DO-NOT-PREFILL");
  await expect(page.getByLabel("Project type", { exact: true })).toHaveValue(
    "",
  );
  await expect(page.getByLabel("What needs building or fixing?")).toHaveValue(
    "",
  );
  const tools = page.locator("#project-inquiry .inquiry-tools");
  await tools
    .getByRole("button", { name: "Copy project brief template", exact: true })
    .click();
  await expect(tools.locator("details")).toHaveAttribute("open", "");
  await expect(tools.getByRole("status")).toContainText("Copy unavailable");
});

test("Project inquiries remain available without site JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4339/contact/#project-inquiry");
    await expect(page.locator("[data-project-inquiry]")).toBeVisible();
    await expect(page.locator("[data-project-inquiry]")).toHaveAttribute(
      "action",
      "/api/inquiry",
    );
    await expect(page.locator("[data-project-inquiry]")).toHaveAttribute(
      "method",
      "post",
    );
    const tools = page.locator("#project-inquiry .inquiry-tools");
    await expect(
      tools.getByRole("link", { name: "info@madebykreativ.com" }),
    ).toHaveAttribute("href", projectInquiryHref);
    await tools.getByText("Project brief template", { exact: true }).click();
    await expect(tools.locator("pre")).toContainText(
      "Approximate budget (EUR)",
    );
  } finally {
    await context.close();
  }
});

for (const width of [320, 768, 1280]) {
  test(`Client pages fit ${width}px with accessible themes`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/contact/",
      "/services/wordpress/",
      "/services/qa-api-testing/",
      "/work/",
      "/work/wordpress-link-reporting/",
      "/work/website-quality-checks/",
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      for (const image of await page.locator('img[loading="lazy"]').all())
        await image.scrollIntoViewIfNeeded();
      for (const theme of ["light", "dark"]) {
        if ((await page.locator("html").getAttribute("data-theme")) !== theme)
          await page.locator("#theme-toggle").click();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(
          result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((node) => node.target),
          })),
          `${path} ${theme}`,
        ).toEqual([]);
        if (process.env.VISUAL_PROOF) {
          await page.evaluate(() => scrollTo(0, 0));
          const slug = path === "/" ? "home" : path.replaceAll("/", "-");
          await page.screenshot({
            path: `/tmp/kreativ-clients-${slug}-${width}-${theme}.png`,
            fullPage: true,
          });
          if (path === "/")
            await page.screenshot({
              path: `/tmp/kreativ-clients-home-${width}-${theme}-viewport.png`,
            });
        }
      }
    }
  });
}
