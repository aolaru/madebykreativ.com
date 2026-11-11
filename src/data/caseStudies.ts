export const qaSample = {
  id: "KQA-001",
  title: "New page rendered with an older cached stylesheet",
  project: "Made by KREATIV's own website",
  observedOn: "2026-11-11",
  type: "Public sample finding, not a commissioned client audit",
  status: "Resolved in commit 96da064",
  impact:
    "High visual impact on the affected page: missing card layouts, oversized portfolio images and horizontal overflow on narrow viewports. This finding does not establish a data-security impact.",
  environment:
    "GitHub Pages origin behind Cloudflare. The new Services HTML was available while the unversioned /style.css response still contained the older stylesheet.",
  steps: [
    "Open the new /services/ page while the CDN serves the earlier /style.css response.",
    "Inspect the service and portfolio sections at a narrow viewport.",
    "Check the stylesheet body as well as its HTTP status.",
  ],
  expected:
    "The new HTML receives the matching stylesheet; service cards use the responsive grid and portfolio images remain within their frames.",
  actual:
    "The stylesheet returned HTTP 200 but lacked the Services rules. Images overflowed their containers and the intended grids were absent.",
  resolution:
    "Content-based versions were added to shared CSS and JavaScript URLs. Build and production checks verify that referenced asset bytes match their versions.",
  regression: [
    "Simulate stale unversioned CSS and JavaScript and verify that the page requests versioned URLs instead.",
    "Assert grid layout, bounded image sizes and no horizontal overflow at 320, 768, 861 and 1280 CSS pixels.",
    "Check both themes, quote destinations and relevant navigation journeys in Chromium, Firefox and WebKit.",
  ],
  limitations:
    "A snapshot of one observed issue and its targeted checks. It is not a complete website audit, independent certification or evidence of coverage for a customer's system.",
  evidence:
    "https://github.com/aolaru/madebykreativ.com/actions/runs/43029314414",
  tests:
    "https://github.com/aolaru/madebykreativ.com/blob/96da06411c73c0088ed5748a0650865eb2af5ca2/tests/services.spec.mjs",
};

export const caseStudies = [
  {
    slug: "wordpress-link-reporting",
    title: "A WordPress reporting workflow, without a site crawler",
    shortTitle: "Visitor-reported broken links",
    category: "WordPress plugin",
    product: "Kreativ Report Broken Link",
    summary:
      "A focused plugin connecting visitor reports to a moderation and CSV-export workflow in WordPress.",
    image: "/services/work/report-broken-link.webp",
    imageAlt:
      "The published WordPress dashboard for reviewing broken-link reports.",
    width: 960,
    height: 600,
    service: "wordpress",
    problem:
      "A site owner needs a practical way to receive and act on reports of broken links. A background crawler is not always the desired solution, and an inbox alone does not provide a clear moderation workflow.",
    contribution:
      "Independent plugin development under the Kreativ name: a visitor-facing report action connected to a WordPress administration workflow. This is a published independent product, not a commissioned client project.",
    decisions: [
      {
        title: "Keep the product focused",
        text: "Visitors initiate reports. The plugin does not crawl the site or claim to detect every broken link automatically.",
      },
      {
        title: "Make reports actionable",
        text: "Administrators can filter link reports, change their status and export a CSV for follow-up outside WordPress.",
      },
      {
        title: "Make behavior configurable",
        text: "The public release documents supported post-type controls, optional notifications and retention settings rather than assuming one workflow fits every site.",
      },
    ],
    result:
      "A public WordPress plugin with an inspectable release history and a real administration interface. No customer time savings, revenue impact or download-performance claim is made here.",
    testingTitle: "What the public release evidence shows",
    testing:
      "The official changelog records work on submission errors, filtered CSV exports, schema upgrades and report moderation. These are useful regression risks for this kind of plugin. The release history is not an independent audit of every WordPress configuration.",
    evidence: [
      {
        label: "Official plugin listing and changelog",
        href: "https://wordpress.org/plugins/kreativ-report-broken-link/",
      },
      {
        label: "Public WordPress source repository",
        href: "https://plugins.svn.wordpress.org/kreativ-report-broken-link/",
      },
    ],
  },
  {
    slug: "website-quality-checks",
    title: "Catching a broken layout after a successful deployment",
    shortTitle: "Beyond a successful deployment",
    category: "QA and release engineering",
    product: "Made by KREATIV",
    summary:
      "An actual stale-stylesheet incident turned into a reproducible finding and a deployment regression check.",
    image: "/services/hero-work.webp",
    imageAlt:
      "Real product screenshots from the Services page affected by the stylesheet incident.",
    width: 1440,
    height: 640,
    service: "qa-api-testing",
    problem:
      "A successful deployment and HTTP 200 responses did not guarantee a usable page. Cloudflare served the new Services HTML alongside an older cached stylesheet, leaving oversized images and an unstructured layout.",
    contribution:
      "Investigation and regression coverage on this independently maintained website. The public example demonstrates how an observable problem becomes a scoped report and a repeatable check; it is not confidential enterprise or client work.",
    decisions: [
      {
        title: "Reproduce the visitor's experience",
        text: "Inspect the ordinary live page without bypassing its cache, then compare the returned CSS with the intended asset. This separates a delivery problem from a missing layout implementation.",
      },
      {
        title: "Check content, not only status codes",
        text: "Use content-based asset versions and verify that the stylesheet and script bodies match the versions referenced by the HTML.",
      },
      {
        title: "Keep the failure reproducible",
        text: "Simulate the stale-cache condition in browser tests and assert the responsive grids, image bounds and navigation rather than relying only on a screenshot or a deployment badge.",
      },
    ],
    result:
      "The fix was deployed in commit 96da064 on November 11, 2026. Its public workflow passed, and the live page was checked without a cache bypass in Chromium, Firefox and WebKit. This records that verification snapshot, not a guarantee about every future release.",
    testingTitle: "Public, inspectable QA evidence",
    testing:
      "The sample finding below includes the environment, reproduction steps, expected and actual behavior, resolution and targeted regression coverage. The linked workflow and source tests show the check implementation.",
    evidence: [
      { label: "Successful fix deployment", href: qaSample.evidence },
      { label: "Versioned regression test source", href: qaSample.tests },
    ],
  },
];

export const caseStudyPath = (slug: string) => `/work/${slug}/`;
