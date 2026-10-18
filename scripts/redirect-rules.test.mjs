import assert from "node:assert/strict";
import test from "node:test";
import {
  cloudflareRedirectCsv,
  parseRedirects,
  readRedirects,
} from "./redirect-rules.mjs";

test("redirects include slashless legacy URLs without matching article descendants", async () => {
  const redirects = await readRedirects();
  assert.equal(redirects.size, 14);
  assert.equal(redirects.get("/news"), "/updates/");
  assert.equal(redirects.get("/news/"), "/updates/");
  assert.equal(redirects.get("/news/an-article/"), undefined);
  assert.equal(redirects.get("/apps/"), undefined);
});

test("CSV targets canonical HTTPS, preserves queries and excludes other subdomains", () => {
  assert.equal(
    cloudflareRedirectCsv(parseRedirects("/old/ /new/ 301")),
    [
      "madebykreativ.com/old/,https://madebykreativ.com/new/,301,TRUE,FALSE,FALSE,FALSE",
      "www.madebykreativ.com/old/,https://madebykreativ.com/new/,301,TRUE,FALSE,FALSE,FALSE",
      "madebykreativ.com/old,https://madebykreativ.com/new/,301,TRUE,FALSE,FALSE,FALSE",
      "www.madebykreativ.com/old,https://madebykreativ.com/new/,301,TRUE,FALSE,FALSE,FALSE",
      "",
    ].join("\n"),
  );
});

test("unsafe targets, duplicate rules, chains and loops are rejected", () => {
  for (const manifest of [
    "/old/ https://external.example/ 301",
    "/old/ /new/ 302",
    "/old/ /old/ 301",
    "/old/ /new/ 301\n/old/ /other/ 301",
    "/old/ /new/ 301\n/new/ /last/ 301",
  ])
    assert.throws(() => parseRedirects(manifest));
});
