import { getCollection } from "astro:content";
import { buildUrl } from "../../data/site";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const entries = (await getCollection("news"))
    .sort((a, b) => b.data.sortDate.valueOf() - a.data.sortDate.valueOf())
    .map((entry) => {
      const path = `/news/${entry.id.replace(/\.md$/, "")}/`;
      return `    <item>
      <title>${escapeXml(entry.data.title)}</title>
      <link>${escapeXml(buildUrl(path))}</link>
      <guid>${escapeXml(buildUrl(path))}</guid>
      <pubDate>${entry.data.sortDate.toUTCString()}</pubDate>
      <category>${escapeXml(entry.data.category)}</category>
      <description>${escapeXml(entry.data.description)}</description>
    </item>`;
    })
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Made by Kreativ News</title>
    <link>${buildUrl("/news/")}</link>
    <description>Product updates, project launches, ecosystem notes, and engineering changes from Made by Kreativ.</description>
${entries}
  </channel>
</rss>
`, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
