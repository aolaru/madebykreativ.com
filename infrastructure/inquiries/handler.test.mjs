import test from "node:test";
import assert from "node:assert/strict";
import { handleInquiry, validateInquiry, serviceIds } from "./handler.mjs";
import { inquiryOptions } from "../../src/data/engagements.ts";
const valid = {
  email: "demo@example.com",
  name: "Synthetic sender",
  service: "qa-audit",
  summary: "A synthetic form test.",
  consent: "yes",
  source: "services",
};
const request = (data = valid, extra = {}) =>
  new Request("https://madebykreativ.com/api/inquiry", {
    method: "POST",
    headers: {
      Origin: "https://madebykreativ.com",
      "Content-Type": "application/json",
      Accept: "application/json",
      "CF-Connecting-IP": "192.0.2.1",
      ...extra,
    },
    body: JSON.stringify(data),
  });
function setup() {
  const sent = [],
    keys = [];
  return {
    sent,
    keys,
    env: {
      DESTINATION_EMAIL: "owner@example.com",
      INQUIRY_EMAIL: { send: async (mail) => sent.push(mail) },
      INQUIRY_LIMIT: {
        limit: async ({ key }) => {
          keys.push(key);
          return { success: true };
        },
      },
    },
    create: (from, to, raw) => ({ from, to, raw }),
  };
}
test("server and website agree on supported package IDs", () =>
  assert.deepEqual(
    serviceIds,
    inquiryOptions.map((x) => x.id),
  ));
test("valid inquiry sends once to the configured owner with a safe reply address", async () => {
  const s = setup(),
    r = await handleInquiry(request(), s.env, s.create),
    data = await r.json();
  assert.equal(r.status, 200);
  assert.equal(data.ok, true);
  assert.match(data.reference, /^[a-f0-9-]{36}$/);
  assert.equal(s.sent.length, 1);
  assert.equal(s.sent[0].to, "owner@example.com");
  assert.match(s.sent[0].raw, /Reply-To: <demo@example.com>/);
  assert.equal(s.keys[0].length, 64);
  assert.ok(!s.keys[0].includes("192.0.2.1"));
  assert.equal(r.headers.get("cache-control"), "no-store");
  assert.ok(!JSON.stringify(data).includes(valid.summary));
});
test("native no-JavaScript posts receive a real HTML confirmation", async () => {
  const s = setup(),
    req = new Request("https://madebykreativ.com/api/inquiry", {
      method: "POST",
      headers: {
        Origin: "https://madebykreativ.com",
        "CF-Connecting-IP": "192.0.2.1",
      },
      body: new URLSearchParams(valid),
    });
  const r = await handleInquiry(req, s.env, s.create);
  assert.equal(r.status, 200);
  assert.match(await r.text(), /accepted for email delivery/);
  assert.equal(s.sent.length, 1);
});
test("cross-origin, missing consent, invalid email and honeypot never send", async () => {
  const s = setup();
  assert.equal(
    (
      await handleInquiry(
        request(valid, { Origin: "https://attacker.example" }),
        s.env,
        s.create,
      )
    ).status,
    403,
  );
  for (const input of [
    { ...valid, consent: "" },
    { ...valid, email: "invalid" },
    { ...valid, email: "a@example.com\r\nBcc: x@example.com" },
    { ...valid, website: "bot" },
    { ...valid, summary: " " },
    { ...valid, service: "unrecognized" },
    { ...valid, links: "javascript:alert(1)" },
    { ...valid, deadline: "2026-02-31" },
    { ...valid, summary: "x".repeat(1501) },
  ])
    assert.equal(
      (await handleInquiry(request(input), s.env, s.create)).status,
      400,
    );
  assert.equal(s.sent.length, 0);
});
test("limits, failed delivery and missing configuration never return success", async () => {
  const s = setup();
  s.env.INQUIRY_LIMIT.limit = async () => ({ success: false });
  const limited = await handleInquiry(request(), s.env, s.create);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("Retry-After"), "60");
  assert.equal(s.sent.length, 0);
  s.env.INQUIRY_LIMIT.limit = async () => ({ success: true });
  s.env.INQUIRY_EMAIL.send = async () => {
    throw new Error("private-provider-detail");
  };
  const failed = await handleInquiry(request(), s.env, s.create);
  assert.equal(failed.status, 502);
  assert.ok(!(await failed.text()).includes("private-provider-detail"));
  assert.equal((await handleInquiry(request(), {}, s.create)).status, 503);
});
test("oversized and duplicate native fields are rejected", async () => {
  const s = setup();
  assert.equal(
    (
      await handleInquiry(
        request({ ...valid, summary: "x".repeat(70000) }),
        s.env,
        s.create,
      )
    ).status,
    400,
  );
  const data = new URLSearchParams(valid);
  data.append("email", "other@example.com");
  const req = new Request("https://madebykreativ.com/api/inquiry", {
    method: "POST",
    headers: {
      Origin: "https://madebykreativ.com",
      "CF-Connecting-IP": "192.0.2.1",
    },
    body: data,
  });
  assert.equal((await handleInquiry(req, s.env, s.create)).status, 400);
  assert.equal(s.sent.length, 0);
});
test("source labels cannot carry arbitrary private data", () =>
  assert.equal(
    validateInquiry({ ...valid, source: "visitor@example.com" }).source,
    "direct",
  ));
