export function storefrontHref(href, { page = "website", position = "product" } = {}) {
  if (!href) return undefined;
  const url = new URL(href, "https://madebykreativ.com");
  if (url.hostname !== "madebykreativ.gumroad.com") return href;
  url.searchParams.set("utm_source", "madebykreativ.com");
  url.searchParams.set("utm_medium", "website");
  url.searchParams.set("utm_campaign", "product-to-profit");
  url.searchParams.set("utm_content", `${page}-${position}`);
  return url.toString();
}
