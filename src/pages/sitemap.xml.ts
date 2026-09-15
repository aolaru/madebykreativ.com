import { getCollection } from "astro:content";
import { buildUrl, projectDirectory, projectPath, site } from "../data/site";

const staticRoutes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/product-to-profit/", changefreq: "monthly", priority: "0.9" },
  { path: "/product-to-profit/idea-library/", changefreq: "monthly", priority: "0.8" },
  { path: "/product-to-profit/product-idea-scorecard/", changefreq: "monthly", priority: "0.8" },
  { path: "/product-to-profit/workflow-product-builder/", changefreq: "monthly", priority: "0.8" },
  { path: "/product-to-profit/digital-product-launch-engine/", changefreq: "monthly", priority: "0.8" },
  { path: "/product-to-profit/system/", changefreq: "monthly", priority: "0.8" },
  { path: "/product-to-profit/product-information/", changefreq: "monthly", priority: "0.6" },
  { path: "/projects/", changefreq: "weekly", priority: "0.9" },
  { path: "/updates/", changefreq: "weekly", priority: "0.8" },
  { path: "/privacy/sharesafe/", changefreq: "monthly", priority: "0.6" },
  { path: "/news/", changefreq: "weekly", priority: "0.8" },
  { path: "/about/", changefreq: "monthly", priority: "0.7" },
  { path: "/contact/", changefreq: "monthly", priority: "0.7" }
];

const newsPath = (id: string) => `/news/${id.replace(/\.md$/, "")}/`;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const renderUrl = ({ path, changefreq, priority, lastmod }: { path: string; changefreq: string; priority: string; lastmod: string }) => `  <url>
    <loc>${escapeXml(buildUrl(path))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

export async function GET() {
  const newsRoutes = (await getCollection("news"))
    .sort((a, b) => b.data.sortDate.valueOf() - a.data.sortDate.valueOf())
    .map((entry) => ({
      path: newsPath(entry.id),
      changefreq: "monthly",
      priority: "0.6",
      lastmod: entry.data.sortDate.toISOString().slice(0, 10)
    }));

  const routes = [
    ...staticRoutes.map((route) => ({ ...route, lastmod: site.lastUpdated })),
    ...projectDirectory.map((project) => ({
      path: projectPath(project.slug),
      changefreq: "monthly",
      priority: project.isCore ? "0.8" : "0.7",
      lastmod: site.lastUpdated
    })),
    ...newsRoutes
  ];

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(renderUrl).join("\n")}
</urlset>
`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
