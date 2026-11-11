import { services } from "./services.ts";

const startingPrice = (service: string, index = 0) =>
  services.find((item) => item.id === service)!.prices[index].from;

export const engagementPackages = [
  {
    id: "qa-audit",
    name: "Focused QA Audit",
    from: startingPrice("software-qa"),
    summary:
      "Understand the release risks in an agreed part of your web app or API.",
    buyer:
      "Small software teams preparing a release or investigating unreliable user journeys.",
    inputs:
      "The application area, critical journeys or endpoints, known issues and an authorized test environment.",
    deliverables: [
      "An agreed test scope and risk checklist",
      "Reproducible findings with impact and priority",
      "A written action plan and retest notes within the agreed scope",
    ],
    excludes:
      "Not a penetration test, full-platform certification or ongoing monitoring service.",
    service: "qa-api-testing",
  },
  {
    id: "wordpress-repair",
    name: "WordPress Repair",
    from: startingPrice("wordpress"),
    summary:
      "Resolve a specific plugin issue or improve one existing WordPress workflow.",
    buyer:
      "Site owners and agencies with a reproducible bug or a small customization request.",
    inputs:
      "Steps to reproduce, WordPress and plugin versions, the expected result and a staging plan.",
    deliverables: [
      "A defined issue and proposed fix",
      "The agreed code change or customization",
      "Scoped regression checks and handover notes",
    ],
    excludes:
      "Not a website rebuild, emergency response contract or unlimited maintenance plan.",
    service: "wordpress",
  },
  {
    id: "api-automation",
    name: "API Automation Starter",
    from: startingPrice("software-qa", 1),
    summary:
      "Create a maintainable starting point for repeatable REST API regression checks.",
    buyer:
      "Teams with an existing API and a small, agreed set of high-value regression scenarios.",
    inputs:
      "API documentation, authorized test endpoints, expected behavior and a safe test-data strategy.",
    deliverables: [
      "An agreed endpoint and scenario list",
      "A Java/RestAssured test suite with readable results",
      "Setup, execution and handover instructions",
    ],
    excludes:
      "Not exhaustive API coverage, load testing or indefinite CI administration. CI integration is scoped separately.",
    service: "qa-api-testing",
  },
];

export const inquiryOptions = [
  ...engagementPackages.map((item) => ({ id: item.id, label: item.name })),
  { id: "wordpress-plugin", label: "Custom WordPress plugin" },
  { id: "chrome-extension", label: "Chrome extension" },
  { id: "android-app", label: "Android app" },
  { id: "web-tool", label: "Web tool or automation" },
  { id: "other", label: "Not sure yet / another project" },
];

export const inquiryPath = (packageId?: string) =>
  `/contact/${packageId ? `?service=${encodeURIComponent(packageId)}` : ""}#project-inquiry`;

export const serviceLandingPages = [
  {
    slug: "wordpress",
    title: "WordPress Development",
    seoTitle: "WordPress Plugin Development & Repairs | Made by KREATIV",
    description:
      "Scoped WordPress plugin repairs, custom plugins and workflow improvements by independent developer Andrei Olaru, with testing and clear handover.",
    intro:
      "Fix a plugin problem. Simplify a workflow. Build the small feature your site actually needs.",
    audience:
      "WordPress site owners, maintainers and agencies who need a defined change to an existing site, rather than a new website or an open-ended support contract.",
    outcomes: [
      "Repair a reproducible plugin bug or compatibility issue",
      "Build a small custom plugin around an agreed feature set",
      "Improve an admin workflow or connect a supported REST API",
    ],
    receive: [
      "A written scope and acceptance criteria before implementation",
      "A focused code change or plugin, with ownership and licensing agreed in the proposal",
      "Checks against the agreed WordPress, PHP and plugin environment",
      "Deployment or installation guidance and relevant handover notes",
    ],
    prepare: [
      "Describe what happens now and what should happen instead",
      "Include versions, reproduction steps and redacted examples",
      "Plan a backup and staging environment before changes to a live site",
      "Share credentials only through an agreed secure channel after scope review",
    ],
    boundaries:
      "Hosting migrations, malware removal, 24/7 incident response, third-party license fees and ongoing maintenance are not included by default. Work on production systems requires explicit authorization.",
    caseStudy: "wordpress-link-reporting",
    article: "wordpress-repair-project-brief",
    faq: [
      {
        question: "Can you work with an existing plugin?",
        answer:
          "Yes, subject to code access, licensing and technical fit. The proposal will distinguish a safe extension or customization from changes that could be overwritten by vendor updates.",
      },
      {
        question: "What does the starting price cover?",
        answer:
          "A small, defined repair or customization starts from EUR 200. A small custom plugin starts from EUR 600. Neither is a fixed quote; complexity, integrations and testing requirements determine the proposal.",
      },
      {
        question: "What happens after handover?",
        answer:
          "Acceptance checks, any included retest and handover are agreed in writing. Future compatibility work or ongoing support needs a separate scope; no retainer is implied.",
      },
    ],
  },
  {
    slug: "qa-api-testing",
    title: "Software QA & API Testing",
    seoTitle: "Software QA Audits & API Test Automation | Made by KREATIV",
    description:
      "Fixed-scope web application QA audits and REST API test automation using Java, RestAssured, JUnit and Cucumber, with reproducible findings and clear handover.",
    intro:
      "Find the release risks that matter. Turn important API checks into repeatable tests.",
    audience:
      "Small software teams, founders and agencies with an existing application or API, a specific release concern and an authorized environment to test.",
    outcomes: [
      "Review critical web journeys or a defined API surface before release",
      "Get actionable bug reports, not an unexplained pass/fail label",
      "Start an automated REST API regression suite your team can run and extend",
    ],
    receive: [
      "An agreed application area, risk focus and test-data approach",
      "Findings with reproduction steps, expected versus actual behavior and priority",
      "A written release-risk summary, with coverage limits made explicit",
      "For automation: an agreed Java/RestAssured suite, execution guidance and handover",
    ],
    prepare: [
      "Identify the release, critical journeys and known risks",
      "Provide API documentation and an approved staging or test environment",
      "Use test accounts and synthetic or approved data, not production customer records",
      "Agree permissions, exclusions and how destructive operations will be avoided",
    ],
    boundaries:
      "A focused audit is not a security certification, penetration test, accessibility certification or guarantee of defect-free software. Load testing, broad platform coverage and ongoing monitoring need separate agreements.",
    caseStudy: "website-quality-checks",
    article: "what-a-focused-qa-audit-delivers",
    faq: [
      {
        question: "Do you only offer automation?",
        answer:
          "No. A focused manual audit can be the right first step. Test strategy, regression scenarios, Postman and automated API checks are selected according to the agreed risks and scope.",
      },
      {
        question: "Which tools can be used?",
        answer:
          "Professional capabilities include Java, RestAssured, JUnit, Cucumber, Postman, SQL, Maven, Jenkins and CI/CD. Tooling is agreed around the existing project rather than imposed as a new platform.",
      },
      {
        question: "Is the public QA example client work?",
        answer:
          "No. The public sample documents an actual issue and regression checks on Made by KREATIV's own website. It demonstrates the reporting approach without exposing employer or client systems.",
      },
    ],
  },
];
