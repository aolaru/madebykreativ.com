import { LinkChecker } from "linkinator";

const port = 4329;
const localHosts = new Set(["127.0.0.1", "localhost", "madebykreativ.com"]);
const checker = new LinkChecker();

const result = await checker.check({
  path: "dist",
  port,
  recurse: true,
  checkCss: true,
  checkFragments: true,
  urlRewriteExpressions: [
    {
      pattern: /^https:\/\/madebykreativ\.com/,
      replacement: `http://127.0.0.1:${port}`,
    },
  ],
  linksToSkip: async (url) => {
    if (!url.startsWith("http")) return false;

    return !localHosts.has(new URL(url).hostname);
  },
});

const brokenLinks = result.links.filter(({ state }) => state === "BROKEN");
const checkedLinks = result.links.filter(({ state }) => state === "OK");

if (!result.passed || brokenLinks.length > 0) {
  console.error("Built-site link validation failed:");
  for (const link of brokenLinks) {
    console.error(`- ${link.url} (linked from ${link.parent ?? "entry page"})`);
  }
  process.exitCode = 1;
} else if (checkedLinks.length === 0) {
  console.error("Built-site link validation did not check any local links.");
  process.exitCode = 1;
} else {
  console.log(`Built-site link validation passed for ${checkedLinks.length} local URLs and assets.`);
}
