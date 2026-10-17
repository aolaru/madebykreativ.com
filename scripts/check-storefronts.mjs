import { readFile } from "node:fs/promises";
import { parseDocument, DomUtils } from "htmlparser2";
import { setTimeout as delay } from "node:timers/promises";
import { apps } from "../src/data/apps.ts";
const releases = JSON.parse(
  await readFile(
    new URL("../src/data/productReleases.json", import.meta.url),
    "utf8",
  ),
);
const storefronts = JSON.parse(
  await readFile(
    new URL("../src/data/storefronts.json", import.meta.url),
    "utf8",
  ),
);
const failures = [];

async function check(url, verify) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (new URL(response.url).pathname.includes("login"))
        throw new Error("Redirected to login");
      await verify(parseDocument(await response.text()));
      console.log(`Available and verified: ${url}`);
      return;
    } catch (error) {
      if (attempt === 2) failures.push(`${url}: ${error.message}`);
      else await delay(2000 * (attempt + 1));
    }
  }
}

for (const [key, offer] of Object.entries(storefronts)) {
  await check(`https://madebykreativ.gumroad.com/l/${offer.slug}`, (doc) => {
    const node = DomUtils.findOne(
      (node) => Boolean(node.attribs?.["data-page"]),
      doc.children,
    );
    const product = node
      ? JSON.parse(node.attribs["data-page"]).props?.product
      : null;
    if (
      !product?.is_published ||
      product.is_compliance_blocked ||
      !product.name.includes("KREATIV")
    )
      throw new Error("Published product unavailable");
    if (
      product.currency_code !== offer.currency ||
      product.price_cents !== offer.priceCents
    )
      throw new Error(
        `Base price changed: expected ${offer.priceCents} ${offer.currency} minor units; got ${product.price_cents} ${product.currency_code}`,
      );
    const copy = DomUtils.textContent(
      parseDocument(product.description_html || ""),
    );
    const release = releases[key];
    if (!copy.includes(release.version) || !copy.includes(release.pdfVersion))
      throw new Error("Release version differs from the website manifest");
    if (key !== "system" && !copy.includes(String(release.pages)))
      throw new Error(`Expected ${release.pages} pages in product details`);
    if (
      release.fields > 0 &&
      key !== "system" &&
      !copy.includes(String(release.fields))
    )
      throw new Error(`Expected ${release.fields} fields in product details`);
  });
}

const urls = apps
  .flatMap((app) => app.stores)
  .filter((store) => store.name === "Google Play")
  .map((store) => store.url);
if (urls.length === 0)
  failures.push("No Google Play listings found in the Apps catalogue");
for (const url of urls)
  await check(url, (doc) => {
    const schema = DomUtils.getElementsByTagName("script", doc)
      .filter((node) => node.attribs.type === "application/ld+json")
      .flatMap((node) => {
        const parsed = JSON.parse(DomUtils.textContent(node));
        return Array.isArray(parsed) ? parsed : [parsed];
      });
    if (
      !schema.some(
        (entry) => entry["@type"] === "SoftwareApplication" && entry.name,
      )
    )
      throw new Error("Published Google Play app schema missing");
  });
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
