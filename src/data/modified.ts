import { execFileSync } from "node:child_process";

const root = process.cwd();
const cache = new Map<string, string | undefined>();

// Content dates come from source history, not the date a build happens to run.
export function lastModified(paths: string[], fallback?: string) {
  const key = paths.join("\n");
  if (!cache.has(key)) {
    try {
      const date = execFileSync(
        "git",
        ["log", "-1", "--format=%cs", "--", ...paths],
        { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
      ).trim();
      cache.set(key, /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined);
    } catch {
      cache.set(key, undefined);
    }
  }
  return cache.get(key) || fallback;
}

export function pageModified(path: string) {
  if (
    path.startsWith("/apps/") &&
    path !== "/apps/" &&
    path !== "/apps/support/"
  )
    return lastModified(["src/pages/apps/[slug].astro", "src/data/apps.ts"]);
  if (path.startsWith("/projects/") && path !== "/projects/")
    return lastModified([
      "src/pages/projects/[slug].astro",
      "src/data/site.ts",
    ]);
  if (
    path.startsWith("/product-to-profit/") &&
    ![
      "/product-to-profit/",
      "/product-to-profit/example/",
      "/product-to-profit/product-information/",
    ].includes(path)
  )
    return lastModified([
      "src/components/ProductToProfitProductPage.astro",
      "src/data/productToProfit.ts",
      "src/data/productReleases.json",
    ]);
  const page =
    path === "/" ? "index" : path.replace(/^\//, "").replace(/\/$/, "");
  const file = ["apps", "projects", "privacy", "product-to-profit"].includes(
    page,
  )
    ? `${page}/index`
    : page;
  const sources = [`src/pages/${file}.astro`];
  if (path === "/" || path === "/updates/")
    sources.push("src/content/news", "src/data/siteUpdates.ts");
  if (path === "/apps/") sources.push("src/data/apps.ts");
  if (path === "/projects/") sources.push("src/data/site.ts");
  if (path === "/product-to-profit/")
    sources.push(
      "src/data/productToProfit.ts",
      "src/data/productReleases.json",
    );
  return lastModified(sources);
}
