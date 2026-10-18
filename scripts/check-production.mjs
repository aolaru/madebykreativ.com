import { setTimeout as delay } from "node:timers/promises";
import { readRedirects, siteHosts } from "./redirect-rules.mjs";

const origin = "https://madebykreativ.com";
const routes = [
  "/",
  "/apps/",
  "/apps/paperbuild/",
  "/apps/kreativ-font/",
  "/apps/support/",
  "/updates/",
  "/product-to-profit/",
  "/sitemap.xml",
  "/updates/rss.xml",
  "/privacy/sharesafe/",
];
const failures = [];
const revision = process.env.GITHUB_SHA || String(Date.now());
async function verify(
  url,
  test,
  { redirect = "follow", status, attempts = 6 } = {},
) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const target = new URL(url);
      target.searchParams.set("_check", revision);
      const response = await fetch(target, {
        redirect,
        headers: { "Cache-Control": "no-cache" },
        signal: AbortSignal.timeout(15000),
      });
      if (status ? response.status !== status : !response.ok)
        throw new Error(
          `HTTP ${response.status}${status ? `, expected ${status}` : ""}`,
        );
      const body = await response.text();
      test(response, body);
      console.log(`Healthy: ${url}`);
      return true;
    } catch (error) {
      if (attempt === attempts - 1)
        failures.push(`${url}: ${error.cause?.code || error.message}`);
      else await delay(5000);
    }
  }
  return false;
}
for (const route of routes)
  await verify(origin + route, (response, body) => {
    if (route.endsWith(".xml")) {
      if (!body.includes("<?xml") || !body.includes(origin))
        throw new Error("Expected XML feed or sitemap");
    } else if (
      !body.includes(`<link rel="canonical" href="${origin}${route}">`) ||
      !body.includes('id="main-content"')
    )
      throw new Error(
        "Expected current page with canonical and content landmark",
      );
    if (
      route === "/apps/" &&
      (!body.includes("/apps/paperbuild/") ||
        !body.includes("/apps/kreativ-font/"))
    )
      throw new Error("Current app catalogue has not reached this edge yet");
  });
await verify("http://madebykreativ.com/", (response) => {
  if (new URL(response.url).origin !== origin)
    throw new Error("HTTP did not redirect to canonical HTTPS");
});
if (!process.argv.includes("--skip-www"))
  await verify(
    "https://www.madebykreativ.com/apps/?source=hostname-check",
    (response) => {
      const expected = new URL("/apps/", origin);
      expected.search = new URL(response.url).search;
      if (response.headers.get("location") !== expected.href)
        throw new Error(
          "www must permanently redirect and preserve the path and query string",
        );
    },
    { redirect: "manual", status: 301 },
  );
if (process.argv.includes("--redirects")) {
  redirectChecks: for (const [source, destination] of await readRedirects()) {
    for (const host of siteHosts) {
      for (const protocol of ["https", "http"]) {
        const healthy = await verify(
          `${protocol}://${host}${source}?utm_source=redirect-health&value=a%2Bb&value=two`,
          (response) => {
            const expected = new URL(destination, origin);
            expected.search = new URL(response.url).search;
            if (response.headers.get("location") !== expected.href)
              throw new Error(
                `Expected one-hop permanent redirect to ${expected.href}`,
              );
          },
          { redirect: "manual", status: 301, attempts: 2 },
        );
        if (!healthy) break redirectChecks;
      }
    }
  }
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
