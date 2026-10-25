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
  "/product-to-profit/ai-business-pathways/",
  "/product-to-profit/example/",
  "/product-to-profit/product-information/"
];

const websiteRoutes = ["/updates/", "/privacy/", "/privacy/blockshift/", "/privacy/kreativ-fancy-text/", "/privacy/photofeather/", "/privacy/northlight/", "/privacy/sharesafe/", "/apps/", "/apps/northlight/", "/apps/sharesafe/", "/apps/paperbuild/", "/apps/kreativ-font/", "/apps/photofeather/", "/news/compress-photos-android-photofeather/", "/apps/support/"];
const requiredRoutes = [...productRoutes, ...websiteRoutes, "/news/remove-photo-metadata-android-sharesafe/", "/news/offline-compass-android-northlight/", "/news/photos-to-pdf-android-paperbuild/", "/news/discover-fonts-android-kreativ-font/"];

const productAssets = [
  ...["01-select-photos", "02-resize-presets", "03-custom-resize", "04-measured-results", "05-compare-photos"].flatMap((name) => [".png", "-480.webp", "-960.webp"].map((suffix) => `images/photofeather/tutorial/${name}${suffix}`)),
  ...["01-browse-fonts", "02-load-more", "03-search-catalogue", "04-filter-results", "05-save-shortlist"].flatMap((name) => [".png", "-480.webp", "-960.webp"].map((suffix) => `images/kreativ-font/tutorial/${name}${suffix}`)),
  ...["01-photos-to-pdf", "02-crop-pages", "03-pdf-settings", "04-save-share", "05-recent-pdfs"].flatMap((name) => [".png", "-480.webp", "-960.webp"].map((suffix) => `images/paperbuild/tutorial/${name}${suffix}`)),
  "app-attribution.mjs",
  "product-to-profit/previews/system/workspace-dashboard.webp",
  "og-apps.png",
  ...["sharesafe", "northlight", "paperbuild", "kreativ-font", "photofeather"].flatMap((slug) => ["icon.png", "social.png", "screen-320.webp", "screen-640.webp", "screen-1080.webp"].map((asset) => `apps/${slug}/${asset}`)),
  ...["01-compass", "02-spoken-compass", "03-altimeter", "04-red-light"].map((name) => `images/northlight/tutorial/${name}.png`),
  ...["01-choose-photos", "02-original-metadata", "03-export-options", "04-before-after", "05-ready-to-share"].map((name) => `images/sharesafe/tutorial/${name}.png`),
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
  ["/news/", "/updates/"],
  ["/news.html", "/updates/"],
  ["/posts.html", "/updates/"],
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

const shareSafePolicy = await readFile(new URL("privacy/sharesafe/index.html", distRoot), "utf8");
for (const requirement of [
  'id="privacy-check-heading"',
  'id="sdk-diagnostics-heading"',
  'id="external-links-heading"',
  'https://developers.google.com/ml-kit/android-data-disclosure',
  'https://developers.google.com/ml-kit/terms',
  'per-installation identifiers',
  'images and detection results are not sent to Google',
  'October 15, 2026'
]) {
  if (!shareSafePolicy.includes(requirement)) failures.push(`ShareSafe privacy policy: missing ${requirement}`);
}
for (const obsoleteClaim of [
  'No account, analytics, ads, or cloud storage',
  'We do not add advertising or app-usage analytics SDKs.',
  'The app does not automatically detect faces or sensitive information.'
]) {
  if (shareSafePolicy.includes(obsoleteClaim)) failures.push(`ShareSafe privacy policy: obsolete claim ${obsoleteClaim}`);
}

if (failures.length > 0) {
  console.error(`Built-site validation failed:\n- ${failures.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(
    `Built-site validation passed for ${requiredRoutes.length} routes, ${productAssets.length} assets, and ${redirects.size} compatibility pages.`
  );
}
