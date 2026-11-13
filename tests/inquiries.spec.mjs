import { test, expect } from "@playwright/test";
import { apps } from "../src/data/apps";
import { readFile } from "node:fs/promises";
const result = JSON.parse(await readFile(new URL("../src/data/apiDemoResult.json", import.meta.url), "utf8"));
const reference = "11111111-1111-4111-8111-111111111111";

test("direct inquiry confirms only a successful server response and excludes private details from analytics", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__events = [];
    window.plausible = (name, options) =>
      window.__events.push({ name, props: options.props });
  });
  let posts = 0;
  await page.route("**/api/inquiry", async (route) => {
    posts++;
    expect(route.request().method()).toBe("POST");
    const data = new URLSearchParams(route.request().postData());
    expect(data.get("email")).toBe("synthetic@example.com");
    expect(data.get("consent")).toBe("yes");
    expect(data.get("service")).toBe("qa-audit");
    await route.fulfill({ json: { ok: true, reference } });
  });
  await page.goto("/services/");
  await page.locator('[data-package="qa-audit"] a[data-service-cta]').click();
  await expect(page.getByLabel("Project type", { exact: true })).toHaveValue(
    "qa-audit",
  );
  await page
    .getByLabel("Reply email", { exact: true })
    .fill("synthetic@example.com");
  await page
    .getByLabel("What needs building or fixing?")
    .fill("PRIVATE-SYNTHETIC-BRIEF");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send Inquiry", exact: true }).click();
  await expect(page.locator("[data-inquiry-result]")).toContainText(reference);
  await expect(
    page.getByRole("button", { name: "Send Inquiry", exact: true }),
  ).toBeDisabled();
  expect(posts).toBe(1);
  const events = await page.evaluate(() => window.__events);
  expect(events).toContainEqual({
    name: "Inquiry Accepted",
    props: { service: "qa-audit", source: "services", page: "/contact/" },
  });
  expect(JSON.stringify(events)).not.toMatch(
    /synthetic@example|PRIVATE-SYNTHETIC|11111111/,
  );
  expect(
    await page.evaluate(() =>
      JSON.stringify({ ...localStorage, ...sessionStorage }),
    ),
  ).not.toMatch(/synthetic@example|PRIVATE-SYNTHETIC/);
});

test("pending delivery locks the submitted fields and email alternative until confirmation", async ({ page }) => {
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  await page.route("**/api/inquiry", async route => {
    await pending;
    await route.fulfill({ json: { ok: true, reference } });
  });
  await page.goto("/contact/?service=qa-audit");
  const reply = page.getByLabel("Reply email", { exact: true });
  const summary = page.getByLabel("What needs building or fixing?");
  await reply.fill("synthetic@example.com");
  await summary.fill("Synthetic pending submission");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send Inquiry", exact: true }).click();
  await expect(reply).toBeDisabled();
  await expect(summary).toBeDisabled();
  await expect(page.getByLabel("Project type", { exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Prepare Email Instead" })).toBeDisabled();
  release();
  await expect(page.locator("[data-inquiry-result]")).toContainText(reference);
  await expect(reply).toBeEnabled();
  await expect(summary).toHaveValue("Synthetic pending submission");
});

test("failed delivery keeps the brief and an email alternative without a false confirmation", async ({
  page,
}) => {
  await page.route("**/api/inquiry", (route) =>
    route.fulfill({
      status: 502,
      json: { ok: false, message: "Delivery could not be confirmed." },
    }),
  );
  await page.goto("/contact/?service=wordpress-repair");
  await page
    .getByLabel("Reply email", { exact: true })
    .fill("synthetic@example.com");
  await page
    .getByLabel("What needs building or fixing?")
    .fill("Synthetic repair description");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send Inquiry", exact: true }).click();
  await expect(page.locator("[data-inquiry-result]")).toContainText(
    "do not assume the inquiry was received",
  );
  await expect(page.getByLabel("What needs building or fixing?")).toHaveValue(
    "Synthetic repair description",
  );
  await page
    .getByRole("button", { name: "Prepare Email Instead", exact: true })
    .click();
  await expect(page.locator("[data-project-draft]")).toBeVisible();
  expect(
    new URL(
      await page.locator("[data-project-email]").getAttribute("href"),
    ).searchParams.get("body"),
  ).toContain("Synthetic repair description");
});

test("current evidence, private-free source links and shorter Services remain discoverable", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/services/");
  expect(
    await page.evaluate(() => document.documentElement.scrollHeight),
  ).toBeLessThan(7000);
  await page.goto("/work/api-automation-demo/");
  await expect(page.locator("#api-demo-report")).toContainText(
    "Synthetic API contract checks",
  );
  expect(
    await (await request.get("/work/api-automation-demo/report.json")).json(),
  ).toEqual(result);
  await page.goto("/projects/kreativ-tools/");
  await expect(page.locator(".project-latest-update")).toContainText(
    "returns to active maintenance",
  );
  await page.goto("/privacy/");
  for (const app of apps)
    await expect(
      page.getByRole("link", {
        name: `${app.name} privacy policy`,
        exact: true,
      }),
    ).toHaveAttribute("href", app.privacyUrl);
  for (const path of [
    "/privacy/photofeather/",
    "/privacy/kreativ-fancy-text/",
  ]) {
    const html = await (await request.get(path)).text();
    expect(html).not.toContain("/cdn-cgi/l/email-protection");
  }
  await page.goto("/apps/");
  await expect(page.locator(".apps-card-preview img").first()).toHaveAttribute(
    "loading",
    "eager",
  );
  await expect(page.locator(".apps-card-heading img").first()).toHaveAttribute(
    "src",
    /icon-56\.webp$/,
  );
});

test("desktop More supports keyboard dismissal and all secondary destinations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const more = page.locator(".site-nav-more");
  await more.locator("summary").click();
  await expect(more.getByRole("link")).toHaveText([
    "Websites",
    "Apps",
    "Resources",
    "Updates",
  ]);
  await page.keyboard.press("Escape");
  await expect(more).not.toHaveAttribute("open");
  await expect(more.locator("summary")).toBeFocused();
});
