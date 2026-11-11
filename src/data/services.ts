import { apps } from "./apps.ts";
import { buildUrl, projectDirectory, site } from "./site.ts";

export const servicesDescription =
  "Custom WordPress plugins, Chrome extensions, Android apps, web tools, and API test automation by Made by KREATIV.";

export const services = [
  {
    id: "wordpress",
    name: "WordPress Development",
    summary: "Focused plugins and improvements for an existing WordPress site.",
    capabilities: [
      "Custom plugin development and existing plugin customization",
      "Bug fixes and compatibility updates",
      "Website tools and workflow automation",
      "WordPress REST API integrations",
      "Performance and maintenance improvements",
    ],
    prices: [
      { label: "Plugin fixes or customization", from: 200 },
      { label: "Small custom plugin", from: 600 },
    ],
    scope:
      "A small plugin means an agreed, focused feature set, not an entire platform.",
  },
  {
    id: "chrome-extensions",
    name: "Chrome Extension Development",
    summary:
      "Small browser tools that remove repetitive steps from a workflow.",
    capabilities: [
      "Custom Manifest V3 extensions",
      "Browser productivity tools and workflow automation",
      "Popup and options interfaces",
      "Website and API integrations",
      "Extension debugging and maintenance",
    ],
    prices: [{ label: "Small extension MVP", from: 500 }],
    scope:
      "The proposal defines browser permissions, supported websites and the initial workflow.",
  },
  {
    id: "android",
    name: "Mobile App Development",
    summary: "Practical Android utilities with a clear first-release scope.",
    capabilities: [
      "Android applications and small utility apps",
      "Existing app improvements",
      "API-integrated applications",
      "App interfaces and workflow development",
      "Testing and release preparation",
    ],
    prices: [{ label: "Small Android MVP", from: 1000 }],
    scope:
      "A focused first release, not a full-featured app. iOS projects are considered only after a project-specific technical evaluation; the published examples below are Android apps.",
  },
  {
    id: "software-qa",
    name: "Software QA & API Testing",
    summary:
      "Independent quality engineering for web applications and REST APIs.",
    capabilities: [
      "Web application and REST API testing",
      "Manual and automated regression testing",
      "Test strategy and scenario design",
      "Postman collections and API automation",
      "Java, RestAssured, JUnit and Cucumber",
      "Actionable bug reports and release-readiness assessment",
    ],
    prices: [
      { label: "Fixed-scope QA audit", from: 490 },
      { label: "API automation starter package", from: 1200 },
    ],
    scope:
      "An audit covers an agreed application area or set of user journeys. Automation scope defines the API endpoints, scenarios and handover.",
  },
  {
    id: "web-tools",
    name: "Small Web Tools & Automation",
    summary: "Lightweight software for a specific business task.",
    capabilities: [
      "Custom web utilities and internal productivity tools",
      "Lightweight business applications",
      "API integrations and workflow automation",
      "Existing software improvements and debugging",
    ],
    prices: [],
    scope:
      "Custom quote after reviewing the workflow, integrations and delivery requirements.",
  },
];

export const formatServicePrice = (amount: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);

export const projectInquiryBrief =
  [
    "Hello Andrei,",
    "",
    "Project type:",
    "Brief description:",
    "Required functionality:",
    "Approximate budget (EUR):",
    "Desired deadline:",
    "Relevant links:",
    "",
    "Please do not include passwords, API keys, payment details or confidential customer data.",
  ].join("\n");

export const projectInquiryHref = `mailto:${site.email}?subject=${encodeURIComponent("Software Development Project Inquiry")}&body=${encodeURIComponent(projectInquiryBrief)}`;

export const professionalSkills = [
  {
    title: "Quality engineering",
    skills:
      "Around 15 years of professional software QA experience, including enterprise web applications and API testing.",
  },
  {
    title: "API automation and delivery",
    skills:
      "Java, RestAssured, JUnit, Cucumber, Postman, SQL, Maven, Jenkins and CI/CD.",
  },
  {
    title: "Product development",
    skills:
      "WordPress plugins, Chrome extensions, Android applications, JavaScript, HTML, CSS and Astro.",
  },
  {
    title: "Practical engineering",
    skills:
      "Debugging, maintenance and AI-assisted development, with review and testing appropriate to the agreed scope.",
  },
];

export const workingPrinciples = [
  {
    title: "Development and QA together",
    description:
      "Implementation and testing are considered together, rather than treating quality as a final step.",
  },
  {
    title: "Enterprise experience",
    description:
      "Around 15 years of professional QA work informs risk assessment, regression coverage and release decisions.",
  },
  {
    title: "Published product experience",
    description:
      "Independent plugins, extensions and Android apps provide public examples of software shipped and supported.",
  },
  {
    title: "Clear scope and deliverables",
    description:
      "Agree what is included, how it will be checked and what will be handed over. Changes are discussed before extending the work.",
  },
  {
    title: "Maintainable solutions",
    description:
      "Prefer a small, understandable solution using established tools, with documentation appropriate to the project.",
  },
  {
    title: "Direct communication",
    description:
      "Work directly with Andrei Olaru, the independent developer and QA professional behind Made by KREATIV, not a large agency.",
  },
];

export const projectProcess = [
  {
    title: "Describe your project",
    description:
      "Share the problem, required functionality, goals, approximate budget and desired deadline.",
  },
  {
    title: "Scope and quotation",
    description:
      "I review the fit and prepare a defined proposal. Fixed-price work requires an agreed scope and acceptance criteria.",
  },
  {
    title: "Development and testing",
    description:
      "Build the agreed functionality, apply appropriate testing and communicate progress and decisions.",
  },
  {
    title: "Delivery",
    description:
      "Hand over the agreed files, source code where included in scope, documentation and handover instructions.",
  },
];

export interface ServiceWork {
  id: string;
  name: string;
  description: string;
  category: string;
  capabilities: string[];
  href: string;
  linkLabel: string;
  image: string;
  imageAlt: string;
  imageKind: "screenshot" | "logo" | "app";
  appSlug?: string;
  width: number;
  height: number;
}

const wordpressWork: ServiceWork[] = [
  {
    id: "report-broken-link",
    name: "Kreativ Report Broken Link",
    description:
      "A visitor-reporting workflow with dashboard moderation, internal and external link filters, and CSV export.",
    category: "WordPress plugin",
    capabilities: ["WordPress", "Admin workflows", "CSV export"],
    href: "https://wordpress.org/plugins/kreativ-report-broken-link/",
    linkLabel: "View on WordPress.org",
    image: "/services/work/report-broken-link.webp",
    imageAlt:
      "The published plugin's WordPress dashboard for reviewing broken-link reports.",
    imageKind: "screenshot",
    width: 960,
    height: 600,
  },
  {
    id: "broken-image-finder",
    name: "Kreativ Broken Image Finder",
    description:
      "Find broken image references and missing media files, review reports, and recheck items after repairs.",
    category: "WordPress plugin",
    capabilities: ["WordPress", "Media checks", "WP-CLI"],
    href: "https://wordpress.org/plugins/kreativ-broken-image-finder/",
    linkLabel: "View on WordPress.org",
    image: "/services/work/broken-image-finder.webp",
    imageAlt:
      "The published plugin's WordPress scan summary and broken-image report.",
    imageKind: "screenshot",
    width: 960,
    height: 600,
  },
];

const extensionWork: ServiceWork[] = [
  {
    id: "font-finder",
    name: "Kreativ Font Finder",
    description:
      "Inspect a page's typography, highlight font usage, copy font-family declarations and save discoveries locally.",
    category: "Chrome extension",
    capabilities: ["Typography inspection", "Browser tools", "Local favorites"],
    href: "https://chromewebstore.google.com/detail/kreativ-font-finder/aeofohkmincdjglncljbbimjohlnoknk",
    linkLabel: "View in Chrome Web Store",
    image: "/services/work/font-finder.webp",
    imageAlt: "Official Kreativ Font Finder extension icon.",
    imageKind: "logo",
    width: 256,
    height: 256,
  },
  {
    id: "font-updates",
    name: "Kreativ Font Updates",
    description:
      "A compact Chrome popup for discovering commercial and free font articles in the Kreativ Font catalogue.",
    category: "Chrome extension",
    capabilities: ["Popup interface", "Font discovery", "Catalogue links"],
    href: "https://chromewebstore.google.com/detail/kreativ-font-updates/dogeggjdgldnjmlgdcgokmdpdilggkik",
    linkLabel: "View in Chrome Web Store",
    image: "/services/work/font-updates.webp",
    imageAlt: "Official Kreativ Font Updates extension icon.",
    imageKind: "logo",
    width: 256,
    height: 256,
  },
];

const androidWork = ["sharesafe", "northlight", "paperbuild"].map(
  (slug): ServiceWork => {
    const app = apps.find((item) => item.slug === slug)!;
    return {
      id: slug,
      name: app.name,
      description: app.description,
      category: "Android app",
      capabilities:
        slug === "sharesafe"
          ? ["On-device processing", "Photo metadata", "Android"]
          : slug === "northlight"
            ? ["Phone sensors", "Offline speech", "Android"]
            : ["PDF export", "On-device drafts", "Android"],
      href: app.stores[0].url,
      linkLabel: "View on Google Play",
      image: `/apps/${slug}/screen-640.webp`,
      imageAlt: `${app.name}: ${app.category.toLowerCase()} on Android.`,
      imageKind: "app",
      appSlug: slug,
      width: app.screenshotWidth,
      height: app.screenshotHeight,
    };
  },
);
const fontSite = projectDirectory.find((item) => item.slug === "kreativ-font")!;
export const selectedServiceWork: ServiceWork[] = [
  ...wordpressWork,
  ...extensionWork,
  ...androidWork,
  {
    id: "kreativ-font-website",
    name: fontSite.label,
    description:
      "A curated typography website with font discovery, collections and practical browser-based tools.",
    category: "Website and web tools",
    capabilities: ["Structured catalogue", "Search", "Web utilities"],
    href: fontSite.href,
    linkLabel: "Visit Kreativ Font",
    image: fontSite.preview,
    imageAlt: fontSite.previewAlt,
    imageKind: "screenshot",
    width: 1200,
    height: 750,
  },
];

export const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Made by KREATIV software development and QA services",
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      "@id": buildUrl(`/services/#${service.id}`),
      name: service.name,
      description: service.summary,
      url: buildUrl(`/services/#${service.id}`),
      provider: {
        "@type": "Organization",
        name: site.name,
        url: site.url,
        email: site.email,
      },
    },
  })),
};
