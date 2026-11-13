import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { serviceIds, sources } from "../infrastructure/inquiries/handler.mjs";
const stages = ["received", "qualified", "proposal", "paid", "closed"];

export function recordLead(
  records,
  { reference, source, service, stage, amount },
  now = new Date().toISOString(),
) {
  if (!/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(reference || ""))
    throw new Error(
      "Use the random reference from a received inquiry; never a name or email address.",
    );
  if (!stages.includes(stage))
    throw new Error(
      "Stage must be received, qualified, proposal, paid or closed.",
    );
  const existing = records.find((item) => item.reference === reference);
  if (!existing && stage !== "received")
    throw new Error("Record the received inquiry first.");
  if (!existing && (!sources.includes(source) || !serviceIds.includes(service)))
    throw new Error(
      "Use the fixed source and package labels in the received email.",
    );
  if (existing?.stage === stage)
    throw new Error("This stage is already recorded.");
  const amountEUR = amount === undefined ? existing?.amountEUR : Number(amount);
  if (
    amount !== undefined &&
    (stage !== "paid" || !Number.isFinite(amountEUR) || amountEUR < 0)
  )
    throw new Error(
      "An optional non-negative EUR amount can be recorded only for a paid engagement.",
    );
  const result = {
    reference,
    source: existing?.source || source,
    service: existing?.service || service,
    stage,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    history: [...(existing?.history || []), { stage, at: now }],
    ...(amountEUR === undefined ? {} : { amountEUR }),
  };
  return [...records.filter((item) => item.reference !== reference), result];
}

export function leadSummary(records) {
  const bySource = {};
  for (const item of records) {
    const row = (bySource[item.source] ||= {
      received: 0,
      qualified: 0,
      proposal: 0,
      paid: 0,
      closed: 0,
      recordedEUR: 0,
    });
    for (const stage of new Set(item.history.map((event) => event.stage)))
      row[stage]++;
    if (item.history.some((event) => event.stage === "paid"))
      row.recordedEUR += item.amountEUR || 0;
  }
  return { totalReceived: records.length, bySource };
}

async function main() {
  const [command, reference, ...args] = process.argv.slice(2);
  const path = new URL("../.private/leads.json", import.meta.url);
  let records = [];
  try {
    records = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (command === "report") {
    console.log(JSON.stringify(leadSummary(records), null, 2));
    return;
  }
  if (command !== "record")
    throw new Error(
      "Usage: npm run leads -- report | record REFERENCE --stage received --source services --service qa-audit | record REFERENCE --stage paid --amount 490",
    );
  if (args.length % 2) throw new Error("Options need a value.");
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    if (
      !["--stage", "--source", "--service", "--amount"].includes(args[i]) ||
      Object.hasOwn(options, args[i].slice(2))
    )
      throw new Error("Unknown or duplicate option.");
    options[args[i].slice(2)] = args[i + 1];
  }
  records = recordLead(records, { reference, ...options });
  await mkdir(new URL("../.private/", import.meta.url), {
    recursive: true,
    mode: 0o700,
  });
  const temp = new URL(
    "leads.json.tmp",
    new URL("../.private/", import.meta.url),
  );
  await writeFile(temp, JSON.stringify(records, null, 2) + "\n", {
    mode: 0o600,
  });
  await rename(temp, path);
  console.log(
    "Updated the private local lead register. No data was sent to analytics.",
  );
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
