import { getCollection } from "astro:content";
import { siteUpdates } from "./siteUpdates";

export async function getUpdates() {
  const announcements = (await getCollection("news")).map((entry) => ({
    id: entry.id.replace(/\.md$/, ""),
    date: entry.data.sortDate.toISOString().slice(0, 10),
    kind: entry.data.category,
    title: entry.data.title,
    description: entry.data.description,
    href: `/news/${entry.id.replace(/\.md$/, "")}/`,
  }));
  const seen = new Set<string>();
  const aliases: Record<string, string> = {
    "scorecard-first-product-to-profit-guide":
      "product-to-profit-scorecard-first",
    "toolkit-news": "ai-launch-toolkit-gumroad",
    "how-much-music-release": "how-much-music-live",
  };
  const seenIds = new Set<string>();
  return [...announcements, ...siteUpdates]
    .filter((record) => {
      const key = `${record.date}:${record.title.toLowerCase()}`;
      const id = aliases[record.id] || record.id;
      if (seen.has(key) || seenIds.has(id)) return false;
      seen.add(key);
      seenIds.add(id);
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}
