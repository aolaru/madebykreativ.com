export const site = {
  name: "Made by Kreativ",
  url: "https://madebykreativ.com/",
  logo: "https://madebykreativ.com/favicon.svg",
  email: "info@madebykreativ.com",
  lastUpdated: "2026-08-20"
};

export const isExternalHref = (href: string) => /^https?:\/\//.test(href);

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

export const clientConfig = {
  analytics: {
    productionHost: analytics.productionHost,
    plausible: analytics.plausible
  }
};

export const statusDefinitions = [
  { label: "Active", description: "An active Made by KREATIV project maintained by Andrei." },
  { label: "Open Source", description: "Source is public for contributors; these projects are not maintained by Andrei." }
];

const coreProjects = [
  {
    slug: "kreativ-font",
    href: "https://kreativfont.com",
    sourceHref: null,
    product: "Kreativ Font",
    label: "Kreativ Font",
    category: "Creative Discovery",
    status: "Active",
    title: "Kreativ Font",
    logo: { mark: "F" },
    description: "A curated discovery library for fonts and creative assets focused on typography, style, and inspiration.",
    longDescription: "Kreativ Font helps designers, makers, and builders discover stronger typography references and creative assets without starting from a blank search.",
    whatItSolves: "It reduces the friction of typography research by keeping font discovery and creative references in one focused place.",
    audience: "Designers, creative directors, website builders, and makers who need faster typography decisions.",
    currentStatus: "Active public project maintained by Andrei as part of Made by KREATIV.",
    version: "Active project",
    updated: "July 2026",
    preview: "/project-previews/kreativ-font.png",
    previewAlt: "Kreativ Font homepage showing curated fonts, search, and practical font tools.",
    cta: "Visit Kreativ Font",
    focus: ["Typography discovery", "Creative references", "Style research"],
    proof: ["Curated font discovery", "Project detail page", "Related filtering update"],
    maintenanceNotes: ["Actively maintained by Andrei", "Public site available", "Updates are published when ready"],
    relatedNews: ["kreativ-font-filters", "q1-progress"],
    isCore: true
  },
  {
    slug: "kreativ-sound",
    href: "https://kreativsound.com",
    sourceHref: null,
    product: "Kreativ Sound",
    label: "Kreativ Sound",
    category: "Creative Assets",
    status: "Active",
    title: "Kreativ Sound",
    logo: { mark: "S" },
    description: "Sound packs, textures, and presets for creators working with ambient, experimental, and cinematic material.",
    longDescription: "Kreativ Sound collects practical audio resources, presets, and tutorials for creators who need atmospheric, experimental, and cinematic starting points.",
    whatItSolves: "It gives creators ready-made sonic starting points without forcing them to build every texture, preset, or ambient layer from scratch.",
    audience: "Music producers, sound designers, video creators, and experimental audio makers.",
    currentStatus: "Active public project maintained by Andrei as part of Made by KREATIV.",
    version: "Active project",
    updated: "July 2026",
    preview: "/project-previews/kreativ-sound.png",
    previewAlt: "Kreativ Sound homepage presenting boutique sound packs for electronic and cinematic work.",
    cta: "Explore Sounds",
    focus: ["Preset packs", "Audio textures", "Tutorials"],
    proof: ["Live standalone property", "Free and professional packs", "Tutorial-led sound resources"],
    maintenanceNotes: ["Actively maintained by Andrei", "Public catalogue available", "Updates are published when ready"],
    relatedNews: ["kreativ-sound-packs-tutorials", "q1-progress"],
    isCore: true
  },
  {
    slug: "kreativ-wp",
    href: "https://kreativwp.com",
    sourceHref: null,
    product: "Kreativ WP",
    label: "Kreativ WP",
    category: "Utility Software",
    status: "Active",
    title: "Kreativ WP",
    logo: { mark: "WP" },
    description: "Practical WordPress utilities and maintenance plugins built for real sites and long-term reliability.",
    longDescription: "Kreativ WP focuses on practical WordPress maintenance utilities that solve real site-operation problems without unnecessary complexity.",
    whatItSolves: "It keeps WordPress utility work focused on real maintenance, reliability, and operational needs instead of bloated feature sets.",
    audience: "WordPress site owners, maintainers, developers, and small teams managing real production sites.",
    currentStatus: "Active public project maintained by Andrei as part of Made by KREATIV.",
    version: "Active project",
    updated: "July 2026",
    preview: "/project-previews/kreativ-wp.png",
    previewAlt: "Kreativ WP homepage showing its live WordPress maintenance plugins.",
    cta: "View WP Tools",
    focus: ["WordPress utilities", "Maintenance workflows", "Reliability"],
    proof: ["Dedicated WordPress property", "Practical utility positioning", "Maintenance-focused roadmap"],
    maintenanceNotes: ["Actively maintained by Andrei", "Public site available", "Updates are published when ready"],
    relatedNews: ["q1-progress"],
    isCore: true
  },
  {
    slug: "kreativ-tools",
    href: "https://kreativtools.com",
    sourceHref: "https://github.com/aolaru/kreativtools",
    product: "Kreativ Tools",
    label: "Kreativ Tools",
    category: "Utility Software",
    status: "Open Source",
    title: "Kreativ Tools",
    logo: { mark: "T" },
    description: "Browser-first utilities for image, video, PDF, document, and file workflows built for practical daily use.",
    longDescription: "Kreativ Tools brings file, image, video, PDF, and document utilities into a browser-first workspace for fast everyday production tasks.",
    whatItSolves: "It removes small workflow bottlenecks around file conversion, media utilities, PDFs, and everyday browser-first productivity tasks.",
    audience: "Creators, operators, developers, and anyone who needs fast utility tools without installing desktop software.",
    currentStatus: "The source is public for contributors. The existing site may remain available, but Andrei no longer maintains the project.",
    version: "Open-source handoff",
    updated: "August 2026",
    preview: "/project-previews/kreativ-tools.png",
    previewAlt: "Kreativ Tools homepage showing browser-first job and workflow selection.",
    cta: "Open Kreativ Tools",
    focus: ["Image tools", "PDF and document utilities", "File workflows"],
    proof: ["Live browser utility hub", "Image, PDF, document, and file workflows", "Public ecosystem update"],
    maintenanceNotes: ["No owner maintenance commitment", "Contributions and forks are welcome under the published license", "Public site availability may change"],
    relatedNews: ["maintenance-open-source-transition", "kreativ-tools-live", "homepage-directory-refinement"],
    isCore: true
  }
];

const adjacentProjects = [
  {
    slug: "kreativ-auto",
    label: "Kreativ Auto",
    category: "Reference Projects",
    status: "Active",
    logo: { mark: "A" },
    description: "An automotive project for practical content, useful references, and workflow-oriented tools.",
    longDescription: "Kreativ Auto is an active automotive reference project covering practical buying, diagnosis, maintenance-cost, and parts questions.",
    whatItSolves: "It preserves structured automotive research and practical reference paths in a dedicated public property.",
    audience: "Automotive enthusiasts and practical users looking for structured reference material.",
    currentStatus: "Active public project maintained by Andrei as part of Made by KREATIV.",
    version: "Active project",
    updated: "July 2026",
    preview: "/project-previews/kreativ-auto.png",
    previewAlt: "Kreativ Auto homepage showing public car, problem, and parts guide counts.",
    href: "https://kreativauto.com",
    sourceHref: null,
    cta: "Open Kreativ Auto",
    focus: ["Automotive references", "Practical content", "Ownership context"],
    proof: ["Live buying and diagnostic paths", "20 cars in the public reference set", "58 problem and 58 parts guides"],
    maintenanceNotes: ["Actively maintained by Andrei", "Public reference site available", "Updates are published when ready"],
    relatedNews: ["kreativ-auto-domain-added", "kreativ-auto-roadmap"],
    isCore: false
  },
  {
    slug: "how-much-music",
    label: "How Much Music",
    category: "Discovery Projects",
    status: "Active",
    logo: { mark: "HM" },
    description: "A music-focused project around discovery, value, and practical listening context.",
    longDescription: "How Much Music is a live music-focused project built around listening context, practical discovery, and clearer ways to think about music value.",
    whatItSolves: "It gives music discovery a clearer context layer by focusing on value, listening decisions, and practical ways to evaluate music.",
    audience: "Music listeners, collectors, creators, and people who want a more structured way to think about music discovery.",
    currentStatus: "Active public project maintained by Andrei as part of Made by KREATIV.",
    version: "Active project",
    updated: "July 2026",
    preview: "/project-previews/how-much-music.png",
    previewAlt: "How Much Music homepage showing reviewed song and artist catalogs with methodology.",
    href: "https://howmuchmusic.com",
    sourceHref: null,
    cta: "Open How Much Music",
    focus: ["Music discovery", "Listening context", "Value signals"],
    proof: ["Live standalone property", "Music discovery focus", "Listening context positioning"],
    maintenanceNotes: ["Actively maintained by Andrei", "Public site available", "Updates are published when ready"],
    relatedNews: ["how-much-music-live"],
    isCore: false
  },
  {
    slug: "find-sera",
    label: "Findsera",
    category: "Discovery Projects",
    status: "Open Source",
    logo: { mark: "FS" },
    description: "An archived Astro catalogue and editorial site, published as a reusable open-source starter.",
    longDescription: "Findsera preserves a source-driven product catalogue, editorial guide system, and static Astro publishing workflow for reuse.",
    whatItSolves: "It provides a reference implementation for structured product data, static catalogue generation, and editorial guide publishing.",
    audience: "Developers and publishers looking for a reusable Astro catalogue and editorial starter.",
    currentStatus: "The source is public for contributors. Andrei no longer maintains the project, and the retained site is not operated as a shopping or affiliate service.",
    version: "Open-source archive",
    updated: "August 2026",
    preview: "/project-previews/find-sera.png",
    previewAlt: "Findsera archive homepage showing curated shopping paths and product guides.",
    href: "https://findsera.com",
    sourceHref: "https://github.com/aolaru/findsera.com",
    cta: "View Findsera Archive",
    focus: ["Astro catalogue", "Structured content", "Editorial guides"],
    proof: ["Public MIT-licensed repository", "Archive notice and noindex enabled", "Reusable content and validation scripts"],
    maintenanceNotes: ["No owner maintenance commitment", "Contributions and forks are welcome under the MIT License", "Forks should replace the archived content and branding"],
    relatedNews: ["maintenance-open-source-transition", "find-sera-joins-ecosystem"],
    isCore: false
  },
  {
    slug: "signal-ledger",
    label: "News Ledger",
    category: "Reference Projects",
    status: "Open Source",
    logo: { mark: "NL" },
    description: "A parked news briefing demo with RSS ingestion, topic pages, and a reusable Cloudflare Worker.",
    longDescription: "News Ledger preserves a compact news briefing demo and its RSS-based Cloudflare Worker as an MIT-licensed reference implementation.",
    whatItSolves: "It demonstrates a small static briefing surface backed by RSS ingestion, fixed topics, and a Cloudflare Worker API.",
    audience: "Developers exploring RSS aggregation, topic filtering, and compact briefing interfaces.",
    currentStatus: "The source is public for contributors. Andrei no longer maintains the project or operates it as an active news product.",
    version: "Open-source briefing demo",
    updated: "August 2026",
    preview: null,
    previewAlt: "News Ledger open-source briefing demo with RSS topics and compact article cards.",
    href: "https://github.com/aolaru/signal-ledger",
    sourceHref: "https://github.com/aolaru/signal-ledger",
    cta: "View News Ledger Source",
    focus: ["RSS ingestion", "Topic filtering", "Cloudflare Worker"],
    proof: ["Public MIT-licensed repository", "Reusable Worker and static frontend", "Fixed topic and trust-page routes"],
    maintenanceNotes: ["No owner maintenance commitment", "Contributions and forks are welcome under the MIT License", "No active newsletter, advertising, or monetization work"],
    relatedNews: ["maintenance-open-source-transition", "signal-ledger-added"],
    isCore: false
  }
];

export const projectDirectory = [...coreProjects, ...adjacentProjects];
export const activeProjects = projectDirectory.filter((project) => project.status === "Active");
export const communityProjects = [
  projectDirectory.find((project) => project.slug === "kreativ-tools"),
  projectDirectory.find((project) => project.slug === "find-sera"),
  projectDirectory.find((project) => project.slug === "signal-ledger")
].filter((project): project is (typeof projectDirectory)[number] => Boolean(project));
export const publicProjects = communityProjects;

export const ecosystemLinks = projectDirectory.map((project) => ({
  label: project.label,
  href: project.href,
  isExternal: isExternalHref(project.href)
}));

export const buildUrl = (path: string) => new URL(path, site.url).toString();
export const projectPath = (slug: string) => `/projects/${slug}/`;
export const resolveHref = (href: string) => isExternalHref(href) ? href : buildUrl(href);

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: site.logo,
  sameAs: ecosystemLinks.filter((link) => link.isExternal).map((link) => link.href)
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
    url: resolveHref(project.href)
  }
});

export const createPageSchema = ({ name, description, path, type = "WebPage" }: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage";
}) => ({
  "@context": "https://schema.org",
  "@type": type,
  name,
  description,
  url: buildUrl(path),
  isPartOf: {
    "@type": "WebSite",
    name: site.name,
    url: site.url
  },
  publisher: {
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: site.logo
  }
});

export const createBreadcrumbSchema = (items: Array<{ name: string; path: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: buildUrl(item.path)
  }))
});

export const createDigitalDocumentSchema = ({
  name,
  description,
  path,
  filePath
}: {
  name: string;
  description: string;
  path: string;
  filePath: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "DigitalDocument",
  name,
  description,
  url: buildUrl(path),
  encoding: {
    "@type": "MediaObject",
    contentUrl: buildUrl(filePath),
    encodingFormat: "application/pdf"
  },
  publisher: {
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: site.logo
  }
});

export const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact | ${site.name}`,
  description: "Contact Made by Kreativ about existing purchases, licensing, and public project feedback.",
  url: buildUrl("/contact/"),
  mainEntity: {
    "@type": "Organization",
    name: site.name,
    url: site.url,
    email: site.email
  }
};

interface NewsSchemaInput {
  title: string;
  description: string;
  path: string;
  datePublished: Date;
  dateModified?: Date;
}

export const createNewsArticleSchema = ({ title, description, path, datePublished, dateModified = datePublished }: NewsSchemaInput) => ({
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: title,
  description,
  url: buildUrl(path),
  mainEntityOfPage: buildUrl(path),
  datePublished: datePublished.toISOString(),
  dateModified: dateModified.toISOString(),
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
  name: "Made by Kreativ updates archive",
  itemListElement: entries.map((entry, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: entry.data.title,
    description: entry.data.description,
    url: buildUrl(entry.path)
  }))
});
