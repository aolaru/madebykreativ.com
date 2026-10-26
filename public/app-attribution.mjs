const growthCampaign = "kreativ_growth_20261026";
const campaignSources = new Set(["linkedin", "facebook", "instagram", "youtube"]);
const appSlugs = new Set(["photofeather", "sharesafe", "paperbuild", "northlight", "kreativ-font", "kreativ-fancy-text"]);

// Only forward the campaign labels we publish, never arbitrary query values.
// No cookies, local storage, visitor identifiers, or cross-page persistence.
export function appCampaign(search = "") {
  const params = new URLSearchParams(search);
  const source = params.get("utm_source");
  const content = params.get("utm_content");
  if (params.get("utm_campaign") !== growthCampaign ||
      params.get("utm_medium") !== "organic_social" ||
      !campaignSources.has(source) || !appSlugs.has(content)) return {};
  return { utm_source: source, utm_medium: "organic_social", utm_campaign: growthCampaign, utm_content: content };
}

export function appStoreHref(href, { page = "website", position = "store", search = "" } = {}) {
  const url = new URL(href);
  if (url.hostname !== "play.google.com" || url.pathname !== "/store/apps/details") return href;
  const campaign = new URLSearchParams({
    utm_source: url.searchParams.get("utm_source") || "madebykreativ.com",
    utm_medium: url.searchParams.get("utm_medium") || "website",
    utm_campaign: url.searchParams.get("utm_campaign") || "kreativ-apps",
    utm_content: url.searchParams.get("utm_content") || `${page}-${position}`
  });
  for (const [key, value] of Object.entries(appCampaign(search))) campaign.set(key, value);
  url.searchParams.set("referrer", campaign.toString());
  // Play Console uses top-level UTM labels; Install Referrer uses the encoded copy.
  for (const [key, value] of campaign) url.searchParams.set(key, value);
  return url.toString();
}
