import { setTimeout as delay } from "node:timers/promises";
import { readRedirects, siteHosts } from "./redirect-rules.mjs";
import { sharedAssetReferences, verifyAssetVersion } from "./shared-assets.mjs";
import { requirePublicEmailLink } from "./public-email.mjs";

const origin = "https://madebykreativ.com";
const routes = [
  "/",
  "/services/",
  "/services/wordpress/",
  "/services/qa-api-testing/",
  "/work/",
  "/work/website-quality-checks/",
  "/work/api-automation-demo/",
  "/contact/",
  "/about/",
  "/apps/",
  "/apps/paperbuild/",
  "/news/photos-to-pdf-android-paperbuild/",
  "/apps/kreativ-font/",
  "/news/discover-fonts-android-kreativ-font/",
  "/apps/support/",
  "/updates/",
  "/product-to-profit/",
  "/sitemap.xml",
  "/updates/rss.xml",
  "/privacy/sharesafe/",
  "/privacy/photofeather/",
  "/privacy/kreativ-fancy-text/",
];
const failures = [];
const revision = process.env.GITHUB_SHA || String(Date.now());
const sharedAssetUrls = new Set();
const emailRoutes = new Set(["/services/", "/services/wordpress/", "/services/qa-api-testing/", "/work/website-quality-checks/", "/work/api-automation-demo/", "/contact/", "/about/", "/apps/support/", "/privacy/sharesafe/", "/privacy/photofeather/", "/privacy/kreativ-fancy-text/"]);
async function verify(
  url,
  test,
  { redirect = "follow", status, attempts = 6, cacheBust = true } = {},
) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const target = new URL(url);
      if (cacheBust) target.searchParams.set("_check", revision);
      const response = await fetch(target, {
        redirect,
        headers: cacheBust ? { "Cache-Control": "no-cache" } : undefined,
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
    if (!route.endsWith(".xml"))
      for (const url of sharedAssetReferences(body).values())
        sharedAssetUrls.add(url.href);
    if (emailRoutes.has(route)) {
      requirePublicEmailLink(body);
      if (body.includes("/cdn-cgi/l/email-protection")) throw new Error("A public email link was rewritten by Cloudflare");
    }
  });
await verify(origin + "/api/inquiry", (response, body) => {
  if (JSON.parse(body).status !== "ready") throw new Error("Inquiry delivery is not configured");
});
for (const url of sharedAssetUrls)
  await verify(url, (response, body) => verifyAssetVersion(new URL(url), body), { cacheBust: false });
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
