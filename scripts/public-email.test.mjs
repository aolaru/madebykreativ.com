import test from "node:test";
import assert from "node:assert/strict";
import { publicEmailLinks, requirePublicEmailLink } from "./public-email.mjs";

const link =
  '<a href="mailto:info@madebykreativ.com?subject=Project&amp;body=Hello">Email</a>';
const protectedLink = `<!--email_off-->${link}<!--/email_off-->`;

test("the public email exemption preserves the full mailto destination", () => {
  assert.deepEqual(
    publicEmailLinks(protectedLink, { requireExemption: true }),
    ["mailto:info@madebykreativ.com?subject=Project&body=Hello"],
  );
  assert.doesNotThrow(() => requirePublicEmailLink(link));
});

test("build checks reject missing, nested or unbalanced exemptions", () => {
  for (const html of [
    link,
    `<!--email_off-->${link}`,
    `<!--/email_off-->${link}`,
    `<!--email_off-->${protectedLink}<!--/email_off-->`,
  ])
    assert.throws(() => publicEmailLinks(html, { requireExemption: true }));
});

test("production checks reject a Cloudflare-rewritten fallback even with HTTP 200", () => {
  assert.throws(
    () =>
      requirePublicEmailLink(
        '<a href="/cdn-cgi/l/email-protection#123"><span class="__cf_email__">[email protected]</span></a>',
      ),
    /rewritten/,
  );
  assert.deepEqual(
    publicEmailLinks('<a href="mailto:another@example.com">Other address</a>', {
      requireExemption: true,
    }),
    [],
  );
});
