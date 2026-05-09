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
