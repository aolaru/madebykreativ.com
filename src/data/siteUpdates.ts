export type SiteUpdateKind = "New" | "Update" | "Fix";

export interface SiteUpdate {
  id: string;
  date: string;
  kind: SiteUpdateKind;
  title: string;
  description: string;
  href?: string;
}

export const siteUpdates: SiteUpdate[] = [
  {
    id: "product-to-profit-system",
    date: "2026-08-20",
    kind: "New",
    title: "Product-to-Profit system launched",
    description: "Added the complete five-stage path from idea selection through scoring, product building, launch planning, and the combined system.",
    href: "/product-to-profit/"
  },
  {
    id: "active-project-homepage",
    date: "2026-08-20",
    kind: "Update",
    title: "Homepage now focuses on active work",
    description: "Refocused the homepage on maintained products while clearly identifying Kreativ Tools, Findsera, and News Ledger as public open-source projects.",
    href: "/projects/"
  },
  {
    id: "deployment-quality-gate",
    date: "2026-08-20",
    kind: "Fix",
    title: "Deployment quality gate expanded",
    description: "Added pull-request validation, pinned Node.js, current GitHub Actions, HTML checks, internal-link checks, route and asset assertions, and restricted deployment permissions."
  },
  {
    id: "legacy-route-fallbacks",
    date: "2026-08-20",
    kind: "Fix",
    title: "Legacy routes now redirect reliably",
    description: "Added canonical, noindex, refresh, and JavaScript fallbacks for retired guide and toolkit routes while preserving query strings and fragments."
  },
  {
    id: "project-status-language",
    date: "2026-08-19",
    kind: "Update",
    title: "Project ownership and status clarified",
    description: "Separated actively maintained work from open-source projects that welcome contributors but no longer carry an owner maintenance commitment.",
    href: "/about/"
  },
  {
    id: "cloudflare-web-analytics",
    date: "2026-08-18",
    kind: "New",
    title: "Cloudflare Web Analytics added",
    description: "Added lightweight production analytics for aggregate traffic and performance measurement without loading the beacon during local development."
  },
  {
    id: "astro-upgrade",
    date: "2026-07-30",
    kind: "Update",
    title: "Astro and maintenance setup upgraded",
    description: "Updated the site framework and cleaned obsolete maintenance files so builds use the current source structure and dependency set."
  },
  {
    id: "homepage-simplification",
    date: "2026-07-29",
    kind: "Update",
    title: "Homepage content simplified",
    description: "Reduced repeated explanations and tightened the page around the product system, active projects, public projects, and latest news."
  },
  {
    id: "project-showcases",
    date: "2026-07-27",
    kind: "Update",
    title: "Project discovery and showcases improved",
    description: "Improved navigation into project profiles and added stronger screenshots, project evidence, status context, and next actions."
  },
  {
    id: "books-landing-page",
    date: "2026-07-15",
    kind: "New",
    title: "Books and guides landing page added",
    description: "Created a focused entry point for digital-product resources before those materials evolved into Product-to-Profit."
  },
  {
    id: "guide-gumroad-link",
    date: "2026-07-15",
    kind: "Update",
    title: "Free guide linked directly to Gumroad",
    description: "Changed the primary guide action to use the official Gumroad listing instead of a local download path."
  },
  {
    id: "toolkit-pricing-link",
    date: "2026-07-15",
    kind: "Fix",
    title: "AI toolkit store link and EUR pricing corrected",
    description: "Updated the toolkit to its correct Gumroad listing and aligned the displayed price with the EUR 19 offer."
  },
  {
    id: "site-audit-remediation",
    date: "2026-07-15",
    kind: "Fix",
    title: "Accessibility and site-audit issues resolved",
    description: "Corrected metadata, navigation states, content hierarchy, external-link handling, and other issues identified during the full-site review."
  },
  {
    id: "toolkit-news",
    date: "2026-06-29",
    kind: "New",
    title: "AI Launch Toolkit release note added",
    description: "Published a dedicated news entry announcing Gumroad availability and the original launch offer.",
    href: "/news/ai-launch-toolkit-gumroad/"
  },
  {
    id: "homepage-hero-refinement",
    date: "2026-06-29",
    kind: "Update",
    title: "Homepage hero branding refined",
    description: "Removed the repeated oversized K mark, enlarged the navigation mark, and tightened the first viewport around the brand and primary actions."
  },
  {
    id: "project-card-logos",
    date: "2026-06-28",
    kind: "New",
    title: "Project logos added to directory cards",
    description: "Introduced distinct compact marks for each project so the ecosystem is easier to scan and individual properties are easier to recognize.",
    href: "/projects/"
  },
  {
    id: "ecosystem-page-polish",
    date: "2026-06-28",
    kind: "Update",
    title: "Ecosystem pages and cards polished",
    description: "Improved page hierarchy, project-card composition, responsive behavior, and consistency across homepage, directory, news, about, and contact views."
  },
  {
    id: "first-product-guide",
    date: "2026-06-27",
    kind: "New",
    title: "Your First Digital Product launched",
    description: "Added the original free guide landing page for choosing and validating a small digital-product idea."
  },
  {
    id: "ai-toolkit-page",
    date: "2026-06-27",
    kind: "New",
    title: "AI Launch Toolkit product page launched",
    description: "Added a dedicated paid-product page with deliverables, preview content, practical use cases, and purchase actions."
  },
  {
    id: "header-brand-system",
    date: "2026-06-27",
    kind: "Update",
    title: "Header and K mark standardized",
    description: "Aligned the shared header, navigation menu, logo sizing, active states, share action, and theme control across the website."
  },
  {
    id: "project-profile-pages",
    date: "2026-05-14",
    kind: "New",
    title: "Dedicated project profile pages added",
    description: "Created individual pages for every ecosystem project with purpose, audience, status, proof, maintenance notes, and related updates.",
    href: "/projects/"
  },
  {
    id: "project-validation",
    date: "2026-05-14",
    kind: "Fix",
    title: "Project metadata and route checks strengthened",
    description: "Improved project data consistency and expanded checks for profile routes, navigation, metadata, and generated output."
  },
  {
    id: "content-collections",
    date: "2026-05-10",
    kind: "Update",
    title: "News moved into Astro content collections",
    description: "Replaced duplicated page data with validated content entries that power the archive, article pages, related updates, structured data, and RSS feed."
  },
  {
    id: "news-article-pages",
    date: "2026-05-10",
    kind: "New",
    title: "Individual news pages and RSS added",
    description: "Added permanent article routes, richer social metadata, breadcrumbs, related navigation, and a generated RSS feed.",
    href: "/news/"
  },
  {
    id: "automated-sitemap",
    date: "2026-05-10",
    kind: "Fix",
    title: "Sitemap generation automated",
    description: "Moved sitemap output into Astro so static pages, project profiles, and news articles remain synchronized with the source data."
  },
  {
    id: "ecosystem-expansion",
    date: "2026-05-10",
    kind: "New",
    title: "Wider ecosystem directory added",
    description: "Expanded the directory beyond the original core properties with Kreativ Auto, How Much Music, Findsera, and News Ledger."
  },
  {
    id: "node-22-actions",
    date: "2026-04-18",
    kind: "Update",
    title: "Deployment runtime updated",
    description: "Moved the original Astro deployment workflow to Node.js 22 and refreshed sitemap output after the clean-route migration."
  },
  {
    id: "astro-migration",
    date: "2026-04-17",
    kind: "Update",
    title: "Website migrated to Astro",
    description: "Rebuilt the static site around shared Astro layouts, components, typed data, generated routes, and a production dist artifact."
  },
  {
    id: "github-pages-workflow",
    date: "2026-04-17",
    kind: "New",
    title: "GitHub Pages deployment workflow added",
    description: "Added automatic builds and deployments from the main branch using the GitHub Pages artifact pipeline."
  },
  {
    id: "clean-routes",
    date: "2026-04-17",
    kind: "Fix",
    title: "Canonical pages moved to clean routes",
    description: "Replaced legacy .html destinations with trailing-slash routes and retained compatibility pages for older inbound links."
  },
  {
    id: "how-much-music-launch",
    date: "2026-04-17",
    kind: "New",
    title: "How Much Music joined the ecosystem",
    description: "Added the music discovery and listening-context project to the directory and published its launch update.",
    href: "/news/how-much-music-live/"
  },
  {
    id: "kreativ-auto-roadmap",
    date: "2026-04-04",
    kind: "New",
    title: "Kreativ Auto roadmap added",
    description: "Introduced the automotive reference project and documented its early direction in the public updates archive.",
    href: "/news/kreativ-auto-roadmap/"
  },
  {
    id: "homepage-directory-refinement",
    date: "2026-03-28",
    kind: "Update",
    title: "Homepage reorganized as an ecosystem directory",
    description: "Simplified the page hierarchy, improved card layouts, and gave visitors clearer paths into projects and recent updates.",
    href: "/news/homepage-directory-refinement/"
  },
  {
    id: "font-sound-updates",
    date: "2026-03-28",
    kind: "New",
    title: "Kreativ Font and Sound updates published",
    description: "Added release notes for improved font filtering plus expanded sound packs and tutorials."
  },
  {
    id: "news-product-links",
    date: "2026-03-28",
    kind: "Update",
    title: "News entries linked to relevant products",
    description: "Added direct next steps from update cards so readers can move from release context to the affected project."
  },
  {
    id: "hero-navigation-refinement",
    date: "2026-03-17",
    kind: "Update",
    title: "Homepage hero and navigation refined",
    description: "Improved first-viewport hierarchy, menu spacing, responsive navigation, and the balance between branding and content."
  },
  {
    id: "redirect-preview-fix",
    date: "2026-03-16",
    kind: "Fix",
    title: "Redirect previews and sitemap metadata corrected",
    description: "Fixed legacy-page previews and refreshed canonical and sitemap metadata for the current route structure."
  },
  {
    id: "first-cloudflare-analytics",
    date: "2026-03-15",
    kind: "New",
    title: "Initial Cloudflare analytics integration added",
    description: "Introduced the first Cloudflare Web Analytics configuration before later consolidating it in the shared Astro layout."
  },
  {
    id: "news-layout-navigation",
    date: "2026-03-14",
    kind: "Update",
    title: "News layout and shared navigation unified",
    description: "Aligned the news archive with the rest of the website and standardized navigation behavior across primary pages."
  },
  {
    id: "modern-k-mark",
    date: "2026-03-14",
    kind: "Update",
    title: "Modern K mark rolled out",
    description: "Refined the favicon artwork and regenerated SVG, PNG, and Apple touch assets for a consistent brand mark."
  },
  {
    id: "shared-interface-icons",
    date: "2026-03-14",
    kind: "Update",
    title: "Shared interface icons standardized",
    description: "Replaced inconsistent glyph controls with a unified icon treatment across navigation and page actions."
  },
  {
    id: "share-action",
    date: "2026-03-14",
    kind: "New",
    title: "Share action added to navigation",
    description: "Added native page sharing with a copy-link fallback alongside the existing theme control."
  },
  {
    id: "contact-font-property",
    date: "2026-03-12",
    kind: "New",
    title: "Kreativ Font and direct contact details added",
    description: "Expanded the original ecosystem lineup with Kreativ Font and updated the contact page with the primary public email address."
  },
  {
    id: "product-badges-launch-cta",
    date: "2026-03-12",
    kind: "Update",
    title: "Product badges and launch actions added",
    description: "Improved project status scanning and added a clearer Kreativ Tools launch path from the homepage."
  },
  {
    id: "launch-metadata",
    date: "2026-03-11",
    kind: "New",
    title: "Structured data and launch metadata added",
    description: "Added schema markup, redirect coverage, conversion tracking hooks, and stronger launch-focused page actions."
  },
  {
    id: "kreativ-tools-promotion",
    date: "2026-03-08",
    kind: "Update",
    title: "Kreativ Tools launch promotion strengthened",
    description: "Added a more visible launch section and simplified supporting homepage cards around the new public tool property."
  },
  {
    id: "kreativ-tools-links",
    date: "2026-03-07",
    kind: "New",
    title: "Kreativ Tools added to homepage and news",
    description: "Connected the utility project to the ecosystem directory and update coverage for the first time."
  },
  {
    id: "news-roadmap-expansion",
    date: "2026-03-06",
    kind: "New",
    title: "News archive and roadmap expanded",
    description: "Added a fuller updates archive, latest-news content, roadmap context, and shared navigation links."
  },
  {
    id: "shared-scripts-quality-checks",
    date: "2026-03-06",
    kind: "Fix",
    title: "Site scripts and quality checks consolidated",
    description: "Moved repeated behavior into shared scripts and added automated checks for HTML, links, and important page output."
  },
  {
    id: "news-route-rename",
    date: "2026-03-06",
    kind: "Update",
    title: "Posts renamed to News",
    description: "Changed the public section name and navigation while retaining the older posts address as a compatibility route."
  },
  {
    id: "news-ci-fix",
    date: "2026-03-06",
    kind: "Fix",
    title: "News route validation corrected",
    description: "Updated CI and local-link parsing after the route rename so compatibility pages and canonical destinations were checked correctly."
  },
  {
    id: "theme-accessibility",
    date: "2026-03-03",
    kind: "Fix",
    title: "Theme accessibility and social metadata improved",
    description: "Corrected toggle labels and state handling while expanding social sharing metadata across the original static pages."
  },
  {
    id: "brand-styling",
    date: "2026-02-26",
    kind: "Update",
    title: "Brand styling and logo assets refined",
    description: "Established the KREATIV color, typography, card, and logo direction used by the website."
  },
  {
    id: "light-dark-theme",
    date: "2026-02-26",
    kind: "New",
    title: "Light and dark themes added",
    description: "Added a persistent theme switcher and selected the light interface as the default experience."
  },
  {
    id: "error-page-seo-assets",
    date: "2026-02-26",
    kind: "New",
    title: "404 page and core SEO assets added",
    description: "Introduced a branded error route, favicons, social images, canonical metadata, robots directives, and sitemap foundations."
  },
  {
    id: "about-contact-posts",
    date: "2026-02-26",
    kind: "New",
    title: "About, Contact, and Posts pages added",
    description: "Expanded the initial homepage into a small navigable website with shared navigation and supporting information."
  },
  {
    id: "initial-public-site",
    date: "2026-02-25",
    kind: "New",
    title: "Made by Kreativ website launched",
    description: "Published the first branded site structure, custom domain setup, core project presentation, and responsive foundation."
  }
];

export const siteUpdateKindDescriptions: Record<SiteUpdateKind, string> = {
  New: "New pages, products, capabilities, or public resources.",
  Update: "Meaningful improvements to content, navigation, design, or positioning.",
  Fix: "Corrections to accessibility, metadata, routes, validation, or deployment reliability."
};
