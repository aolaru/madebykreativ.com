import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const distRoot = new URL("../dist/", import.meta.url);
const siteUrl = "https://madebykreativ.com";

const productRoutes = [
  "/product-to-profit/",
  "/product-to-profit/idea-library/",
  "/product-to-profit/product-idea-scorecard/",
  "/product-to-profit/workflow-product-builder/",
  "/product-to-profit/digital-product-launch-engine/",
  "/product-to-profit/system/",
  "/product-to-profit/product-information/"
];

const websiteRoutes = ["/updates/", "/privacy/sharesafe/"];
const requiredRoutes = [...productRoutes, ...websiteRoutes];

const productAssets = [
  "og-product-to-profit-guide.png",
  "og-updates.png",
  "downloads/product-to-profit/KREATIV_Idea_Library_v2_Upgrade.zip",
  "downloads/product-to-profit/KREATIV_Product_Idea_Scorecard_v1.1.zip",
  "product-to-profit/covers/ai-business-pathways.png",
  "product-to-profit/covers/digital-product-launch-engine.png",
  "product-to-profit/covers/idea-library.png",
  "product-to-profit/covers/product-idea-scorecard.png",
  "product-to-profit/covers/system.png",
  "product-to-profit/covers/workflow-product-builder.png",
  "product-to-profit/covers/ai-business-pathways-600.webp",
  "product-to-profit/covers/ai-business-pathways-1200.webp",
  "product-to-profit/covers/digital-product-launch-engine-600.webp",
  "product-to-profit/covers/digital-product-launch-engine-1200.webp",
  "product-to-profit/covers/idea-library-600.webp",
  "product-to-profit/covers/idea-library-1200.webp",
  "product-to-profit/covers/product-idea-scorecard-600.webp",
  "product-to-profit/covers/product-idea-scorecard-1200.webp",
  "product-to-profit/covers/system-600.webp",
  "product-to-profit/covers/system-1200.webp",
  "product-to-profit/covers/workflow-product-builder-600.webp",
  "product-to-profit/covers/workflow-product-builder-1200.webp",
  "product-to-profit/previews/builder/format-matrix.png",
  "product-to-profit/previews/builder/product-specification.png",
  "product-to-profit/previews/builder/signal-test-log.png",
  "product-to-profit/previews/idea-library/idea-handoff.png",
  "product-to-profit/previews/launch-engine/builder-handoff.png",
  "product-to-profit/previews/launch-engine/campaign-calendar.png",
  "product-to-profit/previews/launch-engine/proof-trust.png",
  "product-to-profit/previews/launch-engine/sell-ready-completion.png",
  "product-to-profit/previews/scorecard/buyer-situation.png",
  "product-to-profit/previews/scorecard/idea-scorecard.png",
  "product-to-profit/previews/scorecard/product-brief.png",
  "product-to-profit/previews/system/first-action.png",
  "product-to-profit/previews/system/handoff-map.png"
];

const redirects = new Map([
  ["/books/", "/product-to-profit/"],
  ["/guides/", "/product-to-profit/"],
  ["/your-first-digital-product/", "/product-to-profit/idea-library/"],
  ["/ai-launch-toolkit/", "/product-to-profit/system/"],
  ["/news.html", "/news/"],
  ["/posts.html", "/news/"],
  ["/about.html", "/about/"],
  ["/contact.html", "/contact/"]
]);

const failures = [];

const redirectManifest = await readFile(new URL("_redirects", distRoot), "utf8");
for (const [source, destination] of redirects) {
  const rule = `${source} ${destination} 301`;
  if (!redirectManifest.split("\n").includes(rule)) {
    failures.push(`_redirects: missing ${rule}`);
  }
}

for (const route of requiredRoutes) {
  const relativeFile = join(route.slice(1), "index.html");
  try {
    const html = await readFile(new URL(relativeFile, distRoot), "utf8");
    const canonical = `<link rel="canonical" href="${siteUrl}${route}">`;
    if (!html.includes(canonical)) {
      failures.push(`${relativeFile}: missing canonical ${siteUrl}${route}`);
    }
  } catch {
    failures.push(`${relativeFile}: missing generated route`);
  }
}

for (const asset of productAssets) {
  try {
    await access(new URL(asset, distRoot));
  } catch {
    failures.push(`${asset}: missing product asset`);
  }
}

for (const [source, destination] of redirects) {
  const relativeFile = source.endsWith(".html")
    ? source.slice(1)
    : join(source.slice(1), "index.html");

  try {
    const html = await readFile(new URL(relativeFile, distRoot), "utf8");
    const normalizedHtml = html.replace(/\s*\/>/g, ">");
    const expectations = [
      `<meta name="robots" content="noindex,follow">`,
      `<meta http-equiv="refresh" content="0; url=${destination}">`,
      `<link rel="canonical" href="${siteUrl}${destination}">`
    ];

    for (const expectation of expectations) {
      if (!normalizedHtml.includes(expectation)) {
        failures.push(`${relativeFile}: missing ${expectation}`);
      }
    }
  } catch {
    failures.push(`${relativeFile}: missing compatibility page`);
  }
}

const sitemap = await readFile(new URL("sitemap.xml", distRoot), "utf8");
for (const route of requiredRoutes) {
  const location = `<loc>${siteUrl}${route}</loc>`;
  if (!sitemap.includes(location)) {
    failures.push(`sitemap.xml: missing ${siteUrl}${route}`);
  }
}

const cname = (await readFile(new URL("CNAME", distRoot), "utf8")).trim();
if (cname !== "madebykreativ.com") {
  failures.push(`CNAME: expected madebykreativ.com, received ${cname || "empty value"}`);
}

if (failures.length > 0) {
  console.error(`Built-site validation failed:\n- ${failures.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(
    `Built-site validation passed for ${requiredRoutes.length} routes, ${productAssets.length} assets, and ${redirects.size} compatibility pages.`
  );
}
