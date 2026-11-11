import { parseDocument, DomUtils } from "htmlparser2";
import { setTimeout as delay } from "node:timers/promises";
import { selectedServiceWork } from "../src/data/services.ts";

const failures = [];
for (const work of selectedServiceWork) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(work.href, {
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (new URL(response.url).pathname.includes("login"))
        throw new Error("Login required");
      const doc = parseDocument(await response.text());
      const headings = [
        ...DomUtils.getElementsByTagName("title", doc),
        ...DomUtils.getElementsByTagName("h1", doc),
      ];
      if (
        !headings.some((node) => DomUtils.textContent(node).includes(work.name))
      )
        throw new Error("Expected public project title not found");
      console.log(`Verified: ${work.name} — ${work.href}`);
      break;
    } catch (error) {
      if (attempt === 1) failures.push(`${work.name}: ${error.message}`);
      else await delay(2000);
    }
  }
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
