import { readFile, writeFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { parseDocument, DomUtils } from "htmlparser2";
const root = new URL("../", import.meta.url);
const files = [
  "examples/api-automation/pom.xml",
  "examples/api-automation/src/test/java/com/madebykreativ/ApiContractTest.java",
];
const hash = createHash("sha256");
for (const file of files) hash.update(await readFile(new URL(file, root)));
const sourceSha256 = hash.digest("hex");
const target = new URL("src/data/apiDemoResult.json", root);
if (process.argv.includes("--check")) {
  const result = JSON.parse(await readFile(target));
  if (
    result.sourceSha256 !== sourceSha256 ||
    result.failures ||
    result.errors ||
    result.skipped ||
    result.tests !== result.cases.length
  )
    throw new Error(
      "API demonstration evidence is stale or unsuccessful; run Maven verify and regenerate the report.",
    );
  console.log("API demonstration snapshot matches its tested source.");
} else {
  const reportPath = new URL("examples/api-automation/target/surefire-reports/TEST-com.madebykreativ.ApiContractTest.xml", root);
  const reportTime = (await stat(reportPath)).mtime;
  for (const file of files) if ((await stat(new URL(file, root))).mtime > reportTime) throw new Error("Run Maven verify after changing the example before recording new evidence.");
  const xml = await readFile(reportPath, "utf8");
  const doc = parseDocument(xml, { xmlMode: true });
  const suite = DomUtils.getElementsByTagName("testsuite", doc)[0];
  const result = {
    type: "Synthetic API demonstration; not a client audit",
    observedOn: reportTime.toISOString().slice(0, 10),
    tests: Number(suite.attribs.tests),
    failures: Number(suite.attribs.failures),
    errors: Number(suite.attribs.errors),
    skipped: Number(suite.attribs.skipped),
    sourceSha256,
    cases: DomUtils.getElementsByTagName("testcase", suite).map((node) => ({
      name: node.attribs.name,
      status: node.children.some((n) =>
        ["failure", "error", "skipped"].includes(n.name),
      )
        ? "not-passed"
        : "passed",
    })),
  };
  if (result.failures || result.errors || result.skipped)
    throw new Error(
      "Do not publish unsuccessful demonstration evidence as passing.",
    );
  await writeFile(target, JSON.stringify(result, null, 2) + "\n");
  console.log(
    `Recorded ${result.tests} passing synthetic API checks with their source hash.`,
  );
}
