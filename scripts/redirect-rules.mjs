import { readFile } from "node:fs/promises";

export const siteOrigin = "https://madebykreativ.com";
export const siteHosts = ["madebykreativ.com", "www.madebykreativ.com"];

export function parseRedirects(manifest) {
  const redirects = new Map();
  for (const line of manifest.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const match = line.match(/^(\/[a-z0-9/.-]*)\s+(\/[a-z0-9/.-]*)\s+301\s*$/);
    if (!match) throw new Error(`Invalid permanent redirect: ${line}`);
    const [, source, destination] = match;
    for (const path of source.endsWith("/")
      ? [source, source.slice(0, -1)]
      : [source]) {
      if (!path || path === destination || redirects.has(path))
        throw new Error(`Duplicate or self-referencing redirect: ${path}`);
      redirects.set(path, destination);
    }
  }
  for (const destination of redirects.values()) {
    if (redirects.has(destination))
      throw new Error(`Redirect chain: ${destination}`);
  }
  return redirects;
}

export async function readRedirects() {
  return parseRedirects(
    await readFile(new URL("../public/_redirects", import.meta.url), "utf8"),
  );
}

export function cloudflareRedirectCsv(redirects) {
  return (
    [...redirects]
      .flatMap(([source, destination]) =>
        siteHosts.map(
          (host) =>
            `${host}${source},${siteOrigin}${destination},301,TRUE,FALSE,FALSE,FALSE`,
        ),
      )
      .join("\n") + "\n"
  );
}
