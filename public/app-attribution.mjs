export function appStoreHref(href, { page = "website", position = "store" } = {}) {
  const url = new URL(href);
  if (url.hostname !== "play.google.com" || url.pathname !== "/store/apps/details") return href;
  const campaign = new URLSearchParams({
    utm_source: url.searchParams.get("utm_source") || "madebykreativ.com",
    utm_medium: url.searchParams.get("utm_medium") || "website",
    utm_campaign: url.searchParams.get("utm_campaign") || "kreativ-apps",
    utm_content: url.searchParams.get("utm_content") || `${page}-${position}`
  });
  url.searchParams.set("referrer", campaign.toString());
  return url.toString();
}
