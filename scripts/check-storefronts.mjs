import { readFile } from "node:fs/promises";
const releases = JSON.parse(await readFile(new URL("../src/data/productReleases.json", import.meta.url), "utf8"));
const slugs = [
  "idea-library",
  "product-idea-scorecard",
  "workflow-product-builder",
  "digital-product-launch-engine",
  "ai-business-pathways",
  "product-to-profit-system",
];
const failures = [];
for (const slug of slugs) {
  const url = `https://madebykreativ.gumroad.com/l/${slug}`;
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (new URL(response.url).pathname.includes("login"))
        throw new Error("Redirected to login");
      const html = await response.text();
      const schemaText = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1];
      const product = schemaText ? JSON.parse(schemaText) : null;
      if (product?.["@type"] !== "Product" || !product.name.includes("KREATIV") || product.offers?.availability !== "https://schema.org/InStock") throw new Error("Published product or in-stock offer missing");
      if (["idea-library", "product-idea-scorecard"].includes(slug) && Number(product.offers.price) !== 0) throw new Error("Free product no longer has a zero-price offer");
      const release = releases[slug === "product-to-profit-system" ? "system" : slug];
      const expectedBadge = slug === "product-idea-scorecard" ? `${release.fields} fillable fields` : slug === "workflow-product-builder" ? `${release.pages} pages and ${release.fields} fillable fields` : null;
      if (expectedBadge && !html.includes(expectedBadge)) throw new Error(`Release badge does not match manifest: ${expectedBadge}`);
      console.log(`Available: ${slug}`);
      lastError = null;
      break;
    } catch (error) {
      lastError = error;
      if (attempt < 2)
        await new Promise((resolve) =>
          setTimeout(resolve, 2000 * (attempt + 1)),
        );
    }
  }
  if (lastError) failures.push(`${url}: ${lastError.message}`);
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
