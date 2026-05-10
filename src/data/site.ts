export const site = {
  name: "Made by Kreativ",
  url: "https://madebykreativ.com/",
  logo: "https://madebykreativ.com/kreativ-logo-128.svg",
  email: "info@madebykreativ.com"
};

export const ecosystemLinks = [
  { label: "Kreativ Font", href: "https://kreativfont.com" },
  { label: "Kreativ Sound", href: "https://kreativsound.com" },
  { label: "Kreativ WP", href: "https://kreativwp.com" },
  { label: "Kreativ Tools", href: "https://kreativtools.com" },
  { label: "How Much Music", href: "https://howmuchmusic.com" }
];

export const products = [
  {
    href: "https://kreativfont.com",
    product: "Kreativ Font",
    status: "Curated",
    title: "Kreativ Font",
    description: "A curated discovery library for fonts and creative assets focused on typography, style, and inspiration.",
    cta: "Visit Kreativ Font"
  },
  {
    href: "https://kreativsound.com",
    product: "Kreativ Sound",
    status: "Live",
    title: "Kreativ Sound",
    description: "Sound packs, textures, and presets for creators working with ambient, experimental, and cinematic material.",
    cta: "Explore Sounds"
  },
  {
    href: "https://kreativwp.com",
    product: "Kreativ WP",
    status: "Plugins",
    title: "Kreativ WP",
    description: "Practical WordPress utilities and maintenance plugins built for real sites and long-term reliability.",
    cta: "View WP Tools"
  },
  {
    href: "https://kreativtools.com",
    product: "Kreativ Tools",
    status: "Live",
    title: "Kreativ Tools",
    description: "Browser-first utilities for image, video, PDF, document, and file workflows built for practical daily use.",
    cta: "Open Kreativ Tools"
  }
];

export const secondaryProjects = [
  {
    label: "How Much Music",
    status: "Live",
    description: "A music-focused project around discovery, value, and practical listening context.",
    href: "https://howmuchmusic.com"
  },
  {
    label: "Kreativ Auto",
    status: "Roadmap",
    description: "An automotive project in development for practical content, tools, and resources."
  }
];

export const contactIntents = [
  {
    title: "Product Support",
    description: "Questions about Kreativ Tools, Kreativ WP, Kreativ Font, Kreativ Sound, or related ecosystem projects.",
    subject: "Product support"
  },
  {
    title: "Partnerships",
    description: "Collaboration ideas, cross-promotion, distribution, editorial partnerships, or product integrations.",
    subject: "Partnership inquiry"
  },
  {
    title: "Licensing and Assets",
    description: "Questions about presets, creative assets, usage rights, commercial use, or custom resource requests.",
    subject: "Licensing and assets"
  },
  {
    title: "Product Feedback",
    description: "Suggestions for new tools, workflow improvements, roadmap ideas, or usability feedback.",
    subject: "Product feedback"
  }
];

export const buildUrl = (path: string) => new URL(path, site.url).toString();

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: site.logo,
  sameAs: ecosystemLinks.map((link) => link.href)
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url
};

export const ecosystemItemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Made by Kreativ ecosystem directory",
  itemListElement: [...products, ...secondaryProjects]
    .filter((item) => "href" in item && item.href)
    .map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: "title" in item ? item.title : item.label,
      description: item.description,
      url: item.href
    }))
};

interface NewsSchemaInput {
  title: string;
  description: string;
  path: string;
  datePublished: Date;
}

export const createNewsArticleSchema = ({ title, description, path, datePublished }: NewsSchemaInput) => ({
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: title,
  description,
  url: buildUrl(path),
  mainEntityOfPage: buildUrl(path),
  datePublished: datePublished.toISOString(),
  dateModified: datePublished.toISOString(),
  author: {
    "@type": "Person",
    name: "Andrei Olaru"
  },
  publisher: {
    "@type": "Organization",
    name: site.name,
    logo: {
      "@type": "ImageObject",
      url: site.logo
    }
  }
});

export const createNewsItemListSchema = (
  entries: Array<{ data: { title: string; description: string }; path: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Made by Kreativ news",
  itemListElement: entries.map((entry, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: entry.data.title,
    description: entry.data.description,
    url: buildUrl(entry.path)
  }))
});
