import { mkdir, readFile, writeFile } from "node:fs/promises";
import { cloudflareRedirectCsv, readRedirects } from "./redirect-rules.mjs";

const target = new URL(
  "../infrastructure/cloudflare-redirects.csv",
  import.meta.url,
);
const csv = cloudflareRedirectCsv(await readRedirects());
if (process.argv.includes("--check")) {
  if ((await readFile(target, "utf8")) !== csv)
    throw new Error(
      "Cloudflare redirect import is stale. Run npm run redirects:export.",
    );
  console.log("Cloudflare redirect import matches public/_redirects.");
} else {
  await mkdir(new URL("../infrastructure/", import.meta.url), {
    recursive: true,
  });
  await writeFile(target, csv);
  console.log(
    `Exported ${csv.trim().split("\n").length} exact-match 301 redirects.`,
  );
}
