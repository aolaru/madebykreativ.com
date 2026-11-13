import test from "node:test";
import assert from "node:assert/strict";
import { recordLead, leadSummary } from "./leads.mjs";
const reference = "11111111-1111-4111-8111-111111111111";
test("funnel counts recorded outcomes rather than clicks or generated drafts", () => {
  let data = recordLead([], {
    reference,
    source: "services",
    service: "qa-audit",
    stage: "received",
  });
  for (const stage of ["qualified", "proposal", "paid"])
    data = recordLead(data, {
      reference,
      stage,
      ...(stage === "paid" ? { amount: 490 } : {}),
    });
  assert.deepEqual(leadSummary(data), {
    totalReceived: 1,
    bySource: {
      services: {
        received: 1,
        qualified: 1,
        proposal: 1,
        paid: 1,
        closed: 0,
        recordedEUR: 490,
      },
    },
  });
  assert.ok(!JSON.stringify(data).includes("@"));
});
test("no invented, duplicate or personally identified lead can be added", () => {
  assert.deepEqual(leadSummary([]), { totalReceived: 0, bySource: {} });
  for (const input of [
    { reference: "name@example.com", stage: "received" },
    { reference, stage: "paid" },
    {
      reference,
      source: "email@example.com",
      service: "qa-audit",
      stage: "received",
    },
  ])
    assert.throws(() => recordLead([], input));
  const data = recordLead([], {
    reference,
    source: "direct",
    service: "qa-audit",
    stage: "received",
  });
  assert.throws(() => recordLead(data, { reference, stage: "received" }));
  assert.throws(() =>
    recordLead(data, { reference, stage: "paid", amount: -1 }),
  );
});
