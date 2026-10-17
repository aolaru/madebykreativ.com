import { setTimeout as delay } from "node:timers/promises";

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
async function verify(url, test) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const target = new URL(url);
      target.searchParams.set("_check", revision);
      const response = await fetch(target, {
        headers: { "Cache-Control": "no-cache" },
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await response.text();
      test(response, body);
      console.log(`Healthy: ${url}`);
      return;
    } catch (error) {
      if (attempt === 5)
        failures.push(`${url}: ${error.cause?.code || error.message}`);
      else await delay(5000);
    }
  }
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
  await verify("https://www.madebykreativ.com/", (response) => {
    if (new URL(response.url).origin !== origin)
      throw new Error("www did not redirect to canonical origin");
  });
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
