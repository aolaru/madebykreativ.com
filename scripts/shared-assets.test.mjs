import test from "node:test";
import assert from "node:assert/strict";
import { assetVersion } from "../src/data/assets.ts";
import { sharedAssetReferences, verifyAssetVersion } from "./shared-assets.mjs";

const css = ".services-work-grid { display: grid; }";
const js = "console.log('current behavior');";
const stylesheet = `/style.css?v=${assetVersion(css)}`;
const script = `/site.js?v=${assetVersion(js)}`;
const html = `<link rel="stylesheet" href="${stylesheet}"><script type="module" src="${script}"></script>`;

test("asset versions are deterministic and change with the content", () => {
  assert.equal(assetVersion(css), assetVersion(Buffer.from(css)));
  assert.notEqual(assetVersion(css), assetVersion(css + "\n"));
  const references = sharedAssetReferences(html);
  assert.equal(references.size, 2);
  assert.equal(references.get("/style.css").searchParams.get("v"), assetVersion(css));
  assert.doesNotThrow(() => verifyAssetVersion(references.get("/style.css"), css));
  assert.doesNotThrow(() => verifyAssetVersion(references.get("/site.js"), js));
});

test("HTML checks reject unversioned, missing, duplicate and external shared assets", () => {
  for (const invalid of [
    html.replace(stylesheet, "/style.css"),
    html.replace(script, "/site.js?v=old"),
    `<link rel="stylesheet" href="${stylesheet}">`,
    html + `<link rel="stylesheet" href="${stylesheet}">`,
    html.replace(stylesheet, `https://example.com${stylesheet}`),
  ]) assert.throws(() => sharedAssetReferences(invalid));
});

test("production checks reject stale CSS even when it returns HTTP 200", () => {
  const url = sharedAssetReferences(html).get("/style.css");
  assert.throws(() => verifyAssetVersion(url, "/* stylesheet from an older deployment */"), /cached content/);
});
