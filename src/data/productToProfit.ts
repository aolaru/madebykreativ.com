export type ProductToProfitSlug =
  | "idea-library"
  | "product-idea-scorecard"
  | "workflow-product-builder"
  | "digital-product-launch-engine"
  | "system";

export interface ProductPreview {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
}

export interface ProductDelivery {
  version: string;
  packageName: string;
  packageSize: string;
  fileCount: number;
  formats: string[];
  contents: string[];
  firstStep: string;
}

export type ProductActionKind = "download" | "gumroad" | "wishlist" | "release-notice";

export interface ProductToProfitProduct {
  slug: ProductToProfitSlug;
  stage: string;
  stageNumber: string;
  title: string;
  shortTitle: string;
  role: string;
  promise: string;
  situation: string;
  requiredInput: string;
  output: string;
  handoff: string;
  included: string[];
  exclusions: string[];
  cover: string;
  coverAlt: string;
  accent: string;
  access: "free" | "paid";
  accessLabel: string;
  accessSummary: string;
  price: string;
  storeUrl: string | null;
  storeStatus: string;
  storeCta: string;
  actionKind: ProductActionKind;
  pricingNote: string;
  delivery: ProductDelivery;
  nextSlug: ProductToProfitSlug | null;
  nextLabel: string | null;
  previews: ProductPreview[];
  description: string;
}

export const systemPath = "/product-to-profit/";
export const productPath = (slug: ProductToProfitSlug) => `${systemPath}${slug}/`;
export const productInformationPath = `${systemPath}product-information/`;

export const productToProfitProducts: ProductToProfitProduct[] = [
  {
    slug: "idea-library",
    stage: "Explore",
    stageNumber: "0",
    title: "KREATIV Idea Library",
    shortTitle: "Idea Library",
    role: "Free exploration library",
    promise: "Recognize useful product patterns and narrow them to a shortlist of up to three ideas.",
    situation: "Use this when you want to create a digital product but do not yet have plausible ideas to compare.",
    requiredInput: "Your skills, audience knowledge, and recurring problems you notice.",
    output: "Up to three candidates recorded in an Idea Shortlist.",
    handoff: "Idea Shortlist",
    included: [
      "44-page interactive PDF library",
      "20 practical digital-product formats",
      "Stage 0 boundary and decision guidance",
      "Editable Idea Shortlist"
    ],
    exclusions: [
      "Demand validation or evidence scoring",
      "Pricing or product building",
      "Sales-page writing or promotion",
      "Launch planning or execution"
    ],
    cover: "/product-to-profit/covers/idea-library.png",
    coverAlt: "KREATIV Idea Library cover with a coral folder and 20 digital product idea cards.",
    accent: "coral",
    access: "free",
    accessLabel: "Free product",
    accessSummary: "Free",
    price: "Free",
    storeUrl: "https://madebykreativ.gumroad.com/l/idea-library",
    storeStatus: "Available now on Gumroad as a free EUR 0+ product.",
    storeCta: "Get the free Idea Library on Gumroad",
    actionKind: "gumroad",
    pricingNote: "Enter EUR 0 to get it free, or choose a higher amount if you want to support the work. Gumroad handles checkout and delivery.",
    delivery: {
      version: "Idea Library v1.2 with Stage 0 v2 upgrade",
      packageName: "KREATIV_Idea_Library_v2_Upgrade.zip",
      packageSize: "132 KB",
      fileCount: 3,
      formats: ["Fillable PDF", "CSV", "Markdown"],
      contents: ["44-page Idea Library PDF", "Editable Idea Shortlist CSV", "Stage 0 boundary and start instructions"],
      firstStep: "Unzip the package, read START_HERE_Stage_0_Boundary.md, then use the PDF to shortlist no more than three ideas."
    },
    nextSlug: "product-idea-scorecard",
    nextLabel: "Compare the shortlist",
    previews: [
      {
        src: "/product-to-profit/previews/idea-library/idea-handoff.png",
        alt: "Final Idea Library page explaining the handoff to the Product Idea Scorecard.",
        label: "Explore-to-Choose handoff",
        width: 1191,
        height: 1684
      }
    ],
    description: "Explore practical digital-product patterns and leave with up to three candidates in an Idea Shortlist."
  },
  {
    slug: "product-idea-scorecard",
    stage: "Choose",
    stageNumber: "1",
    title: "KREATIV Product Idea Scorecard",
    shortTitle: "Product Idea Scorecard",
    role: "Free entry product",
    promise: "Compare plausible concepts and choose one product worth testing.",
    situation: "Use this when you have up to three plausible ideas but cannot choose which one deserves a test.",
    requiredInput: "Up to three plausible product ideas and any evidence already available.",
    output: "One evidence-backed Product Brief covering the buyer, problem, format, promise, risk, and next test.",
    handoff: "Product Brief",
    included: [
      "33-page interactive PDF with 145 fillable fields",
      "Evidence Test Kit and Evidence Log",
      "Product Brief template",
      "Workflow Product Builder Intake Pack"
    ],
    exclusions: [
      "Product-file creation or package construction",
      "Pricing execution",
      "Sales copy, promotion, or launch execution",
      "AI-generated claims presented as demand evidence"
    ],
    cover: "/product-to-profit/covers/product-idea-scorecard.png",
    coverAlt: "KREATIV Product Idea Scorecard cover with navy, yellow, orange, and teal decision cards.",
    accent: "teal",
    access: "free",
    accessLabel: "Free product",
    accessSummary: "Free",
    price: "Free",
    storeUrl: "https://madebykreativ.gumroad.com/l/product-idea-scorecard",
    storeStatus: "Available now on Gumroad as a free EUR 0+ product.",
    storeCta: "Get the free Scorecard on Gumroad",
    actionKind: "gumroad",
    pricingNote: "Enter EUR 0 to get it free, or choose a higher amount if you want to support the work. Gumroad handles checkout and delivery.",
    delivery: {
      version: "Scorecard package v1.1",
      packageName: "KREATIV_Product_Idea_Scorecard_v1.1.zip",
      packageSize: "102 KB",
      fileCount: 5,
      formats: ["Fillable PDF", "Markdown", "CSV"],
      contents: ["33-page Product Idea Scorecard PDF", "Evidence Test Kit and Evidence Log", "Product Brief and Builder Intake Pack"],
      firstStep: "Unzip the package, open the Scorecard PDF, and compare no more than three ideas before completing the Product Brief."
    },
    nextSlug: "workflow-product-builder",
    nextLabel: "Build from the Product Brief",
    previews: [
      {
        src: "/product-to-profit/previews/scorecard/buyer-situation.png",
        alt: "Product Idea Scorecard buyer situation worksheet.",
        label: "Buyer situation",
        width: 1075,
        height: 1521
      },
      {
        src: "/product-to-profit/previews/scorecard/idea-scorecard.png",
        alt: "Product Idea Scorecard worksheet with evidence fields and seven scoring factors.",
        label: "Evidence-backed scorecard",
        width: 1075,
        height: 1521
      },
      {
        src: "/product-to-profit/previews/scorecard/product-brief.png",
        alt: "Product Brief worksheet for buyer, problem, format, promise, and version boundary.",
        label: "Product Brief",
        width: 1075,
        height: 1521
      }
    ],
    description: "Compare up to three plausible concepts and finish with one evidence-backed Product Brief."
  },
  {
    slug: "workflow-product-builder",
    stage: "Create",
    stageNumber: "2",
    title: "KREATIV Workflow Product Builder",
    shortTitle: "Workflow Product Builder",
    role: "Paid creation system",
    promise: "Validate one concept and turn it into a useful packaged workflow product.",
    situation: "Use this after you have completed a Product Brief and are ready to build the smallest useful version.",
    requiredInput: "A completed Product Brief with a specific buyer, problem, promise, evidence, risk, and next test.",
    output: "A tested package and a completed Product Specification.",
    handoff: "Product Specification",
    included: [
      "52-page interactive PDF with 211 fillable fields",
      "Five workflow-product format lanes and scope tools",
      "Signal tests, usability test, and quality checks",
      "Product Specification and editable asset package",
      "Fictional Freelancer Client Onboarding Kit sample"
    ],
    exclusions: [
      "Sales pages or checkout copy",
      "Launch emails or campaign planning",
      "Outreach or promotion",
      "Launch execution, which belongs to the Launch Engine"
    ],
    cover: "/product-to-profit/covers/workflow-product-builder.png",
    coverAlt: "KREATIV Workflow Product Builder cover with blue and orange workflow blocks.",
    accent: "blue",
    access: "paid",
    accessLabel: "Paid product",
    accessSummary: "Paid · €19",
    price: "€19",
    storeUrl: "https://madebykreativ.gumroad.com/l/workflow-product-builder",
    storeStatus: "Available now on Gumroad for €19.",
    storeCta: "Get Workflow Product Builder on Gumroad",
    actionKind: "gumroad",
    pricingNote: "Gumroad displays the final total and any applicable tax before payment, then handles checkout and delivery.",
    delivery: {
      version: "Builder package v1.1",
      packageName: "KREATIV_Workflow_Product_Builder_v1.1.zip",
      packageSize: "154 KB",
      fileCount: 20,
      formats: ["Fillable PDF", "Markdown"],
      contents: ["52-page Workflow Product Builder PDF", "Ten editable build, validation, pricing, QA, and handoff assets", "Complete fictional six-file onboarding sample and case study"],
      firstStep: "After delivery, unzip the package, open the PDF, and bring a completed Product Brief into the validation and build workflow."
    },
    nextSlug: "digital-product-launch-engine",
    nextLabel: "Launch the finished package",
    previews: [
      {
        src: "/product-to-profit/previews/builder/format-matrix.png",
        alt: "Workflow Product Builder format matrix for choosing a useful delivery format.",
        label: "Format matrix",
        width: 1406,
        height: 1988
      },
      {
        src: "/product-to-profit/previews/builder/signal-test-log.png",
        alt: "Signal Test Log for recording buyer language and behavior before building.",
        label: "Signal Test Log",
        width: 1406,
        height: 1988
      },
      {
        src: "/product-to-profit/previews/builder/product-specification.png",
        alt: "Product Specification worksheet used as the Launch Engine handoff.",
        label: "Product Specification",
        width: 1406,
        height: 1988
      }
    ],
    description: "Validate one concept, build a useful workflow product, and leave with a tested package and Product Specification."
  },
  {
    slug: "digital-product-launch-engine",
    stage: "Sell + Improve",
    stageNumber: "3",
    title: "KREATIV Digital Product Launch Engine",
    shortTitle: "Digital Product Launch Engine",
    role: "Paid launch system",
    promise: "Position, publish, deliver, measure, and improve a finished digital product.",
    situation: "Use this when the product package is finished and you need a clear buyer path, launch record, and learning loop.",
    requiredInput: "A completed Product Specification and the final product files.",
    output: "A buyer path, Gumroad setup, launch evidence, Launch Record, and Product Change Request.",
    handoff: "Launch Record → Product Change Request",
    included: [
      "42-page interactive PDF with 254 fillable fields",
      "Gumroad Publishing Kit and test-purchase path",
      "Proof and Preview Kit",
      "Sales-page, email, campaign, and respectful outreach assets",
      "Launch Record, metrics, and Product Change Request"
    ],
    exclusions: [
      "Idea generation or idea selection",
      "MVP scope or product-file creation",
      "Technical product QA that belongs in the Builder",
      "Any promise or guarantee of sales"
    ],
    cover: "/product-to-profit/covers/digital-product-launch-engine.png",
    coverAlt: "KREATIV Digital Product Launch Engine cover with black, green, pink, and lime campaign elements.",
    accent: "lime",
    access: "paid",
    accessLabel: "Paid product",
    accessSummary: "Paid · €19",
    price: "€19",
    storeUrl: "https://madebykreativ.gumroad.com/l/digital-product-launch-engine",
    storeStatus: "Available now on Gumroad for €19.",
    storeCta: "Get the Launch Engine on Gumroad",
    actionKind: "gumroad",
    pricingNote: "Gumroad displays the final total and any applicable tax before payment, then handles checkout and delivery.",
    delivery: {
      version: "Launch Engine package v1.1",
      packageName: "KREATIV_Digital_Product_Launch_Engine_v1.1.zip",
      packageSize: "120 KB",
      fileCount: 12,
      formats: ["Fillable PDF", "Markdown", "CSV"],
      contents: ["42-page Digital Product Launch Engine PDF", "Ten editable publishing, proof, sales, campaign, outreach, metrics, and improvement assets", "Clearly fictional end-to-end case study"],
      firstStep: "After delivery, unzip the package and bring the completed Product Specification plus final product files into the publishing workflow."
    },
    nextSlug: "system",
    nextLabel: "See the integrated system",
    previews: [
      {
        src: "/product-to-profit/previews/launch-engine/builder-handoff.png",
        alt: "Launch Engine Builder handoff worksheet for a finished product package.",
        label: "Builder handoff",
        width: 1406,
        height: 1988
      },
      {
        src: "/product-to-profit/previews/launch-engine/proof-trust.png",
        alt: "Launch Engine proof, claims, and trust checklist.",
        label: "Proof and trust",
        width: 1406,
        height: 1988
      },
      {
        src: "/product-to-profit/previews/launch-engine/campaign-calendar.png",
        alt: "Launch Engine campaign calendar worksheet.",
        label: "Campaign calendar",
        width: 1406,
        height: 1988
      },
      {
        src: "/product-to-profit/previews/launch-engine/sell-ready-completion.png",
        alt: "Sell-ready checklist and first post-launch review fields.",
        label: "Sell-ready completion",
        width: 1406,
        height: 1988
      }
    ],
    description: "Create a clear buyer path for a finished product, record launch evidence, and decide what to improve."
  },
  {
    slug: "system",
    stage: "Complete system",
    stageNumber: "All",
    title: "Complete KREATIV Product-to-Profit System",
    shortTitle: "Complete System",
    role: "Integrated bundle",
    promise: "Carry one product from a plausible idea through a tested package, a buyer path, and an evidence-based improvement decision.",
    situation: "Use the bundle when you want the complete workflow, shared workspace, and standardized handoffs in one package.",
    requiredInput: "The input for your current stage: product ideas, a Product Brief, or a finished product package.",
    output: "All core products, AI Business Pathways, the master workspace, complete fictional case study, sample product, implementation tracks, and prompt expansions.",
    handoff: "One connected system of stage outputs",
    included: [
      "Idea Library, Scorecard, Builder, Launch Engine, and AI Business Pathways",
      "Integrated Excel master workspace and standardized handoffs",
      "Complete fictional case study and six-file sample product",
      "Weekend, Seven-Day MVP, and Thirty-Day implementation tracks",
      "Evidence-aware AI prompt vault and Choose, Create, and Sell expansions"
    ],
    exclusions: [
      "Guaranteed demand, sales, or revenue",
      "A replacement for real buyer research",
      "Done-for-you product creation or promotion",
      "Owner-specific legal, tax, refund, privacy, or support policies"
    ],
    cover: "/product-to-profit/covers/system.png",
    coverAlt: "The KREATIV Product-to-Profit System cover with connected purple product boxes.",
    accent: "violet",
    access: "paid",
    accessLabel: "Paid bundle",
    accessSummary: "Paid bundle · €49",
    price: "€49",
    storeUrl: "https://madebykreativ.gumroad.com/l/product-to-profit-system",
    storeStatus: "Available now on Gumroad for €49.",
    storeCta: "Get the complete system on Gumroad",
    actionKind: "gumroad",
    pricingNote: "The €49 price is the current bundle price, not a time-limited discount or a guaranteed savings claim. Gumroad displays the final total and any applicable tax before payment.",
    delivery: {
      version: "Complete system v2.1",
      packageName: "KREATIV_Product-to-Profit_System_v2.1.zip",
      packageSize: "682 KB",
      fileCount: 50,
      formats: ["Fillable PDF", "Excel XLSX", "Markdown", "CSV"],
      contents: ["Idea Library, Scorecard, Builder, Launch Engine, and AI Business Pathways", "Formula-driven master workspace, handoff files, and implementation tracks", "Complete sample product, case study, prompt expansions, license, boundaries, and release notes"],
      firstStep: "After delivery, unzip the package, open 00_Start_Here/README_FIRST.md, then use the master workspace to identify the first stage gate."
    },
    nextSlug: null,
    nextLabel: null,
    previews: [
      {
        src: "/product-to-profit/previews/system/handoff-map.png",
        alt: "Product-to-Profit System handoff map connecting each required input and completed output.",
        label: "System handoff map",
        width: 1571,
        height: 2222
      },
      {
        src: "/product-to-profit/previews/system/first-action.png",
        alt: "Product-to-Profit System worksheet for choosing the first product and work session.",
        label: "Start-here worksheet",
        width: 1571,
        height: 2222
      }
    ],
    description: "The complete Product-to-Profit workflow with all core products, AI Business Pathways, an integrated workspace, case study, sample, tracks, and prompt expansions."
  }
];

export const stageProducts = productToProfitProducts.filter((product) => product.slug !== "system");
export const bundleProduct = productToProfitProducts.find((product) => product.slug === "system")!;
export const scorecardProduct = productToProfitProducts.find((product) => product.slug === "product-idea-scorecard")!;
export const getProductToProfitProduct = (slug: string) => productToProfitProducts.find((product) => product.slug === slug);

export const aiBusinessPathways = {
  title: "KREATIV AI Business Pathways",
  shortTitle: "AI Business Pathways",
  role: "Optional exploration branch",
  bestFor: "Testing whether a product, service, content, or software path deserves a deeper commitment.",
  requiredInput: "One explicit business-path hypothesis.",
  output: "A Business Path Brief, a seven-day evidence experiment, and a Continue, Narrow, Reposition, or Stop decision.",
  price: "€19",
  cover: "/product-to-profit/covers/ai-business-pathways.png",
  coverAlt: "KREATIV AI Business Pathways cover showing connected business-model routes and an evidence-led decision path.",
  storeUrl: "https://madebykreativ.gumroad.com/l/ai-business-pathways",
  storeCta: "Explore AI Business Pathways on Gumroad"
} as const;

export const productPolicies = {
  license: "Personal use for your own projects and business planning. You may customize the materials for your own product work, but may not resell, redistribute, share, sublicense, repackage, publish, or claim authorship of the PDFs, templates, prompts, workbooks, or editable assets.",
  support: "Best-effort support covers purchase access and file problems through the Made by KREATIV contact page. The products do not include consulting, implementation, product review, or a guaranteed response time.",
  updates: "Releases use explicit version numbers. Material update information is published on the relevant product listing or delivery notice. No lifetime-update promise is included.",
  compatibility: "Download and unzip the package before use. Fillable PDFs require a PDF reader that supports form fields. XLSX workbooks work best in Microsoft Excel or a compatible spreadsheet application; formula behavior can vary. Markdown opens in any text editor, and CSV files open in spreadsheet applications.",
  refunds: "Any paid listing will display its current refund policy before purchase. Refund requests are handled through the storefront and applicable consumer law; no separate outcome-based guarantee is offered.",
  tax: "For paid Gumroad purchases, the checkout displays the final total and applicable tax before payment. Gumroad processes the transaction and handles applicable digital-sales tax as merchant of record.",
  privacy: "Gumroad handles checkout, delivery, and related buyer information for free and paid products under its privacy policy."
};

export const systemStages = [
  { stage: "Explore", product: "Idea Library", output: "Idea Shortlist", href: productPath("idea-library") },
  { stage: "Choose", product: "Scorecard", output: "Product Brief", href: productPath("product-idea-scorecard") },
  { stage: "Create", product: "Builder", output: "Product Specification", href: productPath("workflow-product-builder") },
  { stage: "Sell", product: "Launch Engine", output: "Launch Record", href: productPath("digital-product-launch-engine") },
  { stage: "Improve", product: "Launch Engine", output: "Product Change Request", href: productPath("digital-product-launch-engine") }
];

export const startStates = [
  {
    state: "I need product ideas.",
    recommendation: "Start with the Idea Library.",
    detail: "Explore useful product patterns and leave with no more than three candidates.",
    slug: "idea-library" as const
  },
  {
    state: "I have several ideas but cannot choose.",
    recommendation: "Use the Product Idea Scorecard.",
    detail: "Compare up to three plausible ideas and complete one evidence-backed Product Brief.",
    slug: "product-idea-scorecard" as const
  },
  {
    state: "I have a Product Brief and need to build.",
    recommendation: "Open Workflow Product Builder.",
    detail: "Validate the workflow, package version 1, and complete the Product Specification.",
    slug: "workflow-product-builder" as const
  },
  {
    state: "I have finished product files and need to launch.",
    recommendation: "Open Digital Product Launch Engine.",
    detail: "Create the buyer path, launch record, and evidence-based improvement request.",
    slug: "digital-product-launch-engine" as const
  }
];

export const systemFaqs = [
  {
    question: "Do I need to start with the Idea Library?",
    answer: "No. Start at the first stage whose required input you already have. The selector and comparison table keep every route visible."
  },
  {
    question: "Does the system validate an idea for me?",
    answer: "No. It structures evidence gathering and decisions. Attention, likes, and AI-generated claims are not proof of demand."
  },
  {
    question: "Does the Builder include launch copy or promotion?",
    answer: "No. The Builder owns product creation and packaging. Sales pages, launch emails, outreach, and promotion belong to the Launch Engine."
  },
  {
    question: "Does the Launch Engine guarantee sales?",
    answer: "No. It provides a publishing, campaign, measurement, and improvement workflow. Buyer response and commercial outcomes are not guaranteed."
  },
  {
    question: "What makes the bundle more than the individual PDFs?",
    answer: "The bundle adds AI Business Pathways, an integrated master workspace, standardized handoffs, a complete fictional case study, a six-file sample product, three implementation tracks, and evidence-aware prompt expansions."
  },
  {
    question: "What formats are included?",
    answer: "Packages use fillable PDFs plus editable Excel, Markdown, and CSV assets where relevant. Download and unzip the ZIP first, use a PDF reader that supports form fields, and open the XLSX workspace in Microsoft Excel or a compatible spreadsheet application."
  }
];
