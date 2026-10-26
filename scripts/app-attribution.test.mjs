import { test } from "node:test";
import assert from "node:assert/strict";
import { appStoreHref, appCampaign } from "../public/app-attribution.mjs";

const base = "https://play.google.com/store/apps/details?id=com.kreativ.photofeather";
test("campaign attribution reaches both Play Console and Install Referrer", () => {
  const search = "?utm_source=linkedin&utm_medium=organic_social&utm_campaign=kreativ_growth_20261026&utm_content=photofeather&email=private@example.com";
  const url = new URL(appStoreHref(base, { search }));
  const referrer = new URLSearchParams(url.searchParams.get("referrer"));
  for (const [key, value] of Object.entries(appCampaign(search))) {
    assert.equal(url.searchParams.get(key), value);
    assert.equal(referrer.get(key), value);
  }
  assert.ok(!url.href.includes("private"));
});
test("ordinary website links retain existing tutorial campaigns", () => {
  const url = new URL(appStoreHref(base + "&utm_campaign=photo_tutorial", { page: "/news/example/", position: "footer" }));
  assert.equal(url.searchParams.get("utm_campaign"), "photo_tutorial");
  assert.equal(url.searchParams.get("utm_content"), "/news/example/-footer");
  assert.equal(appStoreHref(url.href, { page: "/news/example/", position: "footer" }), url.href);
});
test("unknown or incomplete campaign parameters are not forwarded", () => {
  for (const search of ["?email=private@example.com", "?utm_campaign=kreativ_growth_20261026&utm_source=private@example.com", "?utm_source=linkedin&utm_medium=organic_social&utm_campaign=kreativ_growth_20261026&utm_content=private@example.com"]) {
    assert.deepEqual(appCampaign(search), {});
    assert.ok(!appStoreHref(base, { search }).includes("private"));
  }
  assert.equal(appStoreHref("https://example.com/?id=other"), "https://example.com/?id=other");
});
