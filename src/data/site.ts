export const site = {
  name: "Made by Kreativ",
  url: "https://madebykreativ.com/",
  logo: "https://madebykreativ.com/favicon.svg",
  email: "info@madebykreativ.com",
  lastUpdated: "2026-06-28"
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
    logo: { mark: "F" },
    description: "A curated discovery library for fonts and creative assets focused on typography, style, and inspiration.",
    longDescription: "Kreativ Font helps designers, makers, and builders discover stronger typography references and creative assets without starting from a blank search.",
    whatItSolves: "It reduces the friction of typography research by keeping font discovery and creative references in one focused place.",
    audience: "Designers, creative directors, website builders, and makers who need faster typography decisions.",
    currentStatus: "Curated and maintained as an active discovery resource.",
    cta: "Visit Kreativ Font",
    focus: ["Typography discovery", "Creative references", "Style research"],
    relatedNews: ["kreativ-font-filters", "q1-progress"],
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
    logo: { mark: "S" },
    description: "Sound packs, textures, and presets for creators working with ambient, experimental, and cinematic material.",
    longDescription: "Kreativ Sound collects practical audio resources, presets, and tutorials for creators who need atmospheric, experimental, and cinematic starting points.",
    whatItSolves: "It gives creators ready-made sonic starting points without forcing them to build every texture, preset, or ambient layer from scratch.",
    audience: "Music producers, sound designers, video creators, and experimental audio makers.",
    currentStatus: "Live with free and professional packs, presets, textures, and tutorials.",
    cta: "Explore Sounds",
    focus: ["Preset packs", "Audio textures", "Tutorials"],
    relatedNews: ["kreativ-sound-packs-tutorials", "q1-progress"],
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
    logo: { mark: "WP" },
    description: "Practical WordPress utilities and maintenance plugins built for real sites and long-term reliability.",
    longDescription: "Kreativ WP focuses on practical WordPress maintenance utilities that solve real site-operation problems without unnecessary complexity.",
    whatItSolves: "It keeps WordPress utility work focused on real maintenance, reliability, and operational needs instead of bloated feature sets.",
    audience: "WordPress site owners, maintainers, developers, and small teams managing real production sites.",
    currentStatus: "Plugin-focused property for practical WordPress utilities.",
    cta: "View WP Tools",
    focus: ["WordPress utilities", "Maintenance workflows", "Reliability"],
    relatedNews: ["q1-progress"],
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
    logo: { mark: "T" },
    description: "Browser-first utilities for image, video, PDF, document, and file workflows built for practical daily use.",
    longDescription: "Kreativ Tools brings file, image, video, PDF, and document utilities into a browser-first workspace for fast everyday production tasks.",
    whatItSolves: "It removes small workflow bottlenecks around file conversion, media utilities, PDFs, and everyday browser-first productivity tasks.",
    audience: "Creators, operators, developers, and anyone who needs fast utility tools without installing desktop software.",
    currentStatus: "Live and positioned as the utility hub of the KREATIV ecosystem.",
    cta: "Open Kreativ Tools",
    focus: ["Image tools", "PDF and document utilities", "File workflows"],
    relatedNews: ["kreativ-tools-live", "homepage-directory-refinement"],
    isCore: true
  }
];

const adjacentProjects = [
  {
    slug: "kreativ-auto",
    label: "Kreativ Auto",
    category: "Roadmap",
    status: "Roadmap",
    logo: { mark: "A" },
    description: "An automotive project for practical content, useful references, and workflow-oriented tools.",
    longDescription: "Kreativ Auto is being shaped as an automotive destination for practical information, references, and future utility tooling.",
    whatItSolves: "It creates a dedicated space for automotive research, content, references, and future tools that do not fit inside the creative software properties.",
    audience: "Automotive enthusiasts, researchers, and practical users looking for structured references and future utilities.",
    currentStatus: "Roadmap project with a dedicated domain and direction being shaped.",
    href: "https://kreativauto.com",
    cta: "Open Kreativ Auto",
    focus: ["Automotive references", "Practical content", "Future tools"],
    relatedNews: ["kreativ-auto-domain-added", "kreativ-auto-roadmap"],
    isCore: false
  },
  {
    slug: "how-much-music",
    label: "How Much Music",
    category: "Discovery Projects",
    status: "Live",
    logo: { mark: "HM" },
    description: "A music-focused project around discovery, value, and practical listening context.",
    longDescription: "How Much Music is a live music-focused project built around listening context, practical discovery, and clearer ways to think about music value.",
    whatItSolves: "It gives music discovery a clearer context layer by focusing on value, listening decisions, and practical ways to evaluate music.",
    audience: "Music listeners, collectors, creators, and people who want a more structured way to think about music discovery.",
    currentStatus: "Live as a standalone music-focused KREATIV project.",
    href: "https://howmuchmusic.com",
    cta: "Open How Much Music",
    focus: ["Music discovery", "Listening context", "Value signals"],
    relatedNews: ["how-much-music-live"],
    isCore: false
  },
  {
    slug: "find-sera",
    label: "Find Sera",
    category: "Discovery Projects",
    status: "Project",
    logo: { mark: "FS" },
    description: "A focused discovery project being shaped around search, context, and practical exploration.",
    longDescription: "Find Sera is an exploratory discovery project for search-led navigation, context building, and focused exploration.",
    whatItSolves: "It explores a more intentional discovery flow around search, context, and the act of finding useful signals faster.",
    audience: "Researchers, builders, and curious users who need focused discovery rather than generic browsing.",
    currentStatus: "Exploratory project now included in the public ecosystem directory.",
    href: "https://findsera.com",
    cta: "Open Find Sera",
    focus: ["Search-led discovery", "Context", "Exploration"],
    relatedNews: ["find-sera-joins-ecosystem"],
    isCore: false
  },
  {
    slug: "signal-ledger",
    label: "Signal Ledger",
    category: "Utility Software",
    status: "Project",
    logo: { mark: "SL" },
    description: "A practical ledger project for tracking signals, decisions, and useful references.",
    longDescription: "Signal Ledger is a practical tracking project for collecting signals, decisions, references, and directional notes in one place.",
    whatItSolves: "It creates a structured place to capture decisions, signals, references, and directional notes that would otherwise be scattered.",
    audience: "Operators, researchers, founders, and makers who track signals and decisions over time.",
    currentStatus: "Project-stage utility concept listed as part of the KREATIV software ecosystem.",
    href: "https://getsignalledger.com",
    cta: "Open Signal Ledger",
    focus: ["Signal tracking", "Decision notes", "Reference ledgers"],
    relatedNews: ["signal-ledger-added"],
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
