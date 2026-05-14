export const site = {
  name: "Made by Kreativ",
  url: "https://madebykreativ.com/",
  logo: "https://madebykreativ.com/kreativ-logo-128.svg",
  email: "info@madebykreativ.com",
  lastUpdated: "2026-05-13"
};

export const analytics = {
  productionHost: "madebykreativ.com",
  plausible: {
    domain: "madebykreativ.com",
    src: "https://plausible.io/js/script.js"
  },
  cloudflare: {
    token: "a17af62a5e3f496a944d7eb9012c4915",
    src: "https://static.cloudflareinsights.com/beacon.min.js"
  }
};

export const clientConfig = { analytics };

export const statusDefinitions = [
  { label: "Live", description: "Public and actively available." },
  { label: "Curated", description: "Maintained as a focused discovery resource." },
  { label: "Plugins", description: "Focused on practical WordPress utilities." },
  { label: "Project", description: "Active or exploratory project in the ecosystem." },
  { label: "Roadmap", description: "Planned or being shaped before a wider release." }
];

export const projectCategories = [
  {
    label: "Creative Discovery",
    description: "Projects for finding stronger references, typography, and creative direction."
  },
  {
    label: "Creative Assets",
    description: "Resources and packs for creators working with sound, media, and production material."
  },
  {
    label: "Utility Software",
    description: "Practical browser, WordPress, and tracking tools for day-to-day workflows."
  },
  {
    label: "Discovery Projects",
    description: "Focused destinations for exploration, listening context, and search-led projects."
  },
  {
    label: "Roadmap",
    description: "Upcoming KREATIV projects being shaped before wider release."
  }
];

const coreProjects = [
  {
    slug: "kreativ-font",
    href: "https://kreativfont.com",
    product: "Kreativ Font",
    label: "Kreativ Font",
    category: "Creative Discovery",
    status: "Curated",
    title: "Kreativ Font",
    description: "A curated discovery library for fonts and creative assets focused on typography, style, and inspiration.",
    longDescription: "Kreativ Font helps designers, makers, and builders discover stronger typography references and creative assets without starting from a blank search.",
    cta: "Visit Kreativ Font",
    focus: ["Typography discovery", "Creative references", "Style research"],
    isCore: true
  },
  {
    slug: "kreativ-sound",
    href: "https://kreativsound.com",
    product: "Kreativ Sound",
    label: "Kreativ Sound",
    category: "Creative Assets",
    status: "Live",
    title: "Kreativ Sound",
    description: "Sound packs, textures, and presets for creators working with ambient, experimental, and cinematic material.",
    longDescription: "Kreativ Sound collects practical audio resources, presets, and tutorials for creators who need atmospheric, experimental, and cinematic starting points.",
    cta: "Explore Sounds",
    focus: ["Preset packs", "Audio textures", "Tutorials"],
    isCore: true
  },
  {
    slug: "kreativ-wp",
    href: "https://kreativwp.com",
    product: "Kreativ WP",
    label: "Kreativ WP",
    category: "Utility Software",
    status: "Plugins",
    title: "Kreativ WP",
    description: "Practical WordPress utilities and maintenance plugins built for real sites and long-term reliability.",
    longDescription: "Kreativ WP focuses on practical WordPress maintenance utilities that solve real site-operation problems without unnecessary complexity.",
    cta: "View WP Tools",
    focus: ["WordPress utilities", "Maintenance workflows", "Reliability"],
    isCore: true
  },
  {
    slug: "kreativ-tools",
    href: "https://kreativtools.com",
    product: "Kreativ Tools",
    label: "Kreativ Tools",
    category: "Utility Software",
    status: "Live",
    title: "Kreativ Tools",
    description: "Browser-first utilities for image, video, PDF, document, and file workflows built for practical daily use.",
    longDescription: "Kreativ Tools brings file, image, video, PDF, and document utilities into a browser-first workspace for fast everyday production tasks.",
    cta: "Open Kreativ Tools",
    focus: ["Image tools", "PDF and document utilities", "File workflows"],
    isCore: true
  }
];

const adjacentProjects = [
  {
    slug: "kreativ-auto",
    label: "Kreativ Auto",
    category: "Roadmap",
    status: "Roadmap",
    description: "An automotive project for practical content, useful references, and workflow-oriented tools.",
    longDescription: "Kreativ Auto is being shaped as an automotive destination for practical information, references, and future utility tooling.",
    href: "https://kreativauto.com",
    cta: "Open Kreativ Auto",
    focus: ["Automotive references", "Practical content", "Future tools"],
    isCore: false
  },
  {
    slug: "how-much-music",
    label: "How Much Music",
    category: "Discovery Projects",
    status: "Live",
    description: "A music-focused project around discovery, value, and practical listening context.",
    longDescription: "How Much Music is a live music-focused project built around listening context, practical discovery, and clearer ways to think about music value.",
    href: "https://howmuchmusic.com",
    cta: "Open How Much Music",
    focus: ["Music discovery", "Listening context", "Value signals"],
    isCore: false
  },
  {
    slug: "find-sera",
    label: "Find Sera",
    category: "Discovery Projects",
    status: "Project",
    description: "A focused discovery project being shaped around search, context, and practical exploration.",
    longDescription: "Find Sera is an exploratory discovery project for search-led navigation, context building, and focused exploration.",
    href: "https://findsera.com",
    cta: "Open Find Sera",
    focus: ["Search-led discovery", "Context", "Exploration"],
    isCore: false
  },
  {
    slug: "signal-ledger",
    label: "Signal Ledger",
    category: "Utility Software",
    status: "Project",
    description: "A practical ledger project for tracking signals, decisions, and useful references.",
    longDescription: "Signal Ledger is a practical tracking project for collecting signals, decisions, references, and directional notes in one place.",
    href: "https://getsignalledger.com",
    cta: "Open Signal Ledger",
    focus: ["Signal tracking", "Decision notes", "Reference ledgers"],
    isCore: false
  }
];

export const products = coreProjects;
export const secondaryProjects = adjacentProjects;
export const projectDirectory = [...coreProjects, ...adjacentProjects];

export const ecosystemLinks = projectDirectory.map((project) => ({
  label: project.label,
  href: project.href
}));

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
export const projectPath = (slug: string) => `/projects/${slug}/`;

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
  itemListElement: projectDirectory.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    description: item.description,
    url: buildUrl(projectPath(item.slug))
  }))
};

export const createProjectSchema = (project: (typeof projectDirectory)[number]) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `${project.label} | ${site.name}`,
  description: project.description,
  url: buildUrl(projectPath(project.slug)),
  isPartOf: {
    "@type": "WebSite",
    name: site.name,
    url: site.url
  },
  about: {
    "@type": "Thing",
    name: project.label,
    description: project.longDescription,
    url: project.href
  }
});

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
