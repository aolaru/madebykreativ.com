import { getUpdates } from "../../data/updates";
import { buildUrl } from "../../data/site";
const escapeXml = (text: string) => text.replace(/[<>&"']/g, (char) => ({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&apos;"}[char]!));
export async function GET() {
  const entries = await getUpdates();
  const items = entries.map((entry) => {
    const href = entry.href ? buildUrl(entry.href) : buildUrl(`/updates/#${entry.id}`);
    const guid = entry.kind === "New" || entry.kind === "Update" || entry.kind === "Fix" ? buildUrl(`/updates/#${entry.id}`) : href;
    return `<item><title>${escapeXml(entry.title)}</title><link>${escapeXml(href)}</link><guid>${escapeXml(guid)}</guid><pubDate>${new Date(`${entry.date}T00:00:00Z`).toUTCString()}</pubDate><category>${escapeXml(entry.kind)}</category><description>${escapeXml(entry.description)}</description></item>`;
  });
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Made by Kreativ Updates</title><link>${buildUrl("/updates/")}</link><description>Product releases, project notes, and website improvements.</description>${items.join("")}</channel></rss>`, {headers:{"Content-Type":"application/rss+xml; charset=utf-8"}});
}
