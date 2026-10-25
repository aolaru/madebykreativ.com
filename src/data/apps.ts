export interface KreativApp {
  slug: string;
  name: string;
  description: string;
  category: string;
  accessLabel: string;
  proDescription: string;
  privacyUrl: string;
  privacyNote: string;
  screenshotWidth: number;
  screenshotHeight: number;
  stores: Array<{
    platform: "Android" | "iOS";
    name: "Google Play" | "App Store";
    url: string;
  }>;
  features: string[];
  limitation: string;
}

export const apps: KreativApp[] = [
  {
    slug: "kreativ-fancy-text",
    name: "Kreativ Fancy Text",
    category: "Text and PNG designs",
    accessLabel: "Free",
    privacyUrl: "/privacy/kreativ-fancy-text/",
    privacyNote: "Create on your device without an account, ads, analytics SDK or internet permission. Drafts and saved designs stay local; sharing follows the destination app's policies.",
    description: "Style individual words, copy fancy Unicode text or create matching PNG artwork. An offline Android editor for messages with personality.",
    proDescription: "The app is free, with no purchases or subscriptions. Six themes, 17 text styles and PNG exports are included.",
    screenshotWidth: 1080,
    screenshotHeight: 1920,
    stores: [{platform: "Android", name: "Google Play", url: "https://play.google.com/store/apps/details?id=com.kreativfont.studio"}],
    features: ["Style a whole message or individual words, with per-word image colors", "Export square, portrait or story PNGs at standard or 2x resolution, with optional transparency", "Save up to 50 designs locally, reopen them and keep editing"],
    limitation: "Copied Unicode text depends on the receiving app and does not preserve image colors or artwork. Use PNG to keep the design. This does not install phone fonts or a keyboard. Clearing storage or uninstalling removes local designs; export copies you want to keep.",
  },
  {
    slug: "photofeather",
    name: "PhotoFeather",
    category: "Photo compression",
    accessLabel: "Free",
    privacyUrl: "/privacy/photofeather/",
    privacyNote: "Photos are processed on-device, with no account, ads, analytics SDK or internet permission. Android's system picker may retrieve a photo from a cloud provider you choose.",
    description: "Compress and resize photos for forms, email and sharing. Check measured results and save new JPEG copies while keeping your originals.",
    proDescription: "All described features are included in version 1.0.0, with no purchases or subscriptions.",
    screenshotWidth: 1188,
    screenshotHeight: 2112,
    stores: [{platform: "Android", name: "Google Play", url: "https://play.google.com/store/apps/details?id=com.kreativ.photofeather"}],
    features: ["Choose a 200 KB, 500 KB, 1 MB or custom file-size target", "Resize with Small, Medium, Large or custom longest-edge settings", "Check actual file sizes and dimensions, compare before and after, then save or share new copies"],
    limitation: "Output is lossy JPEG; quality and savings vary. Targets can reduce dimensions and may not always be met. Inputs are JPEG, PNG and static WebP. Metadata removal does not hide visible sensitive details.",
  },
  {
    slug: "sharesafe",
    name: "ShareSafe",
    category: "Photo privacy",
    accessLabel: "Free + optional paid Pro",
    privacyUrl: "/privacy/sharesafe/",
    privacyNote: "Photo processing stays on-device. The Play edition includes ML Kit SDK metrics; the privacy policy explains what those metrics contain.",
    proDescription:
      "Optional ShareSafe Pro adds on-device Face Assist, editable solid Cover areas, blur and pixelation through a one-time Google Play purchase. Face suggestions require review and can miss faces. Metadata cleaning and Privacy Check stay free. Your local Pro price is shown before purchase.",
    screenshotWidth: 1080,
    screenshotHeight: 1920,
    stores: [
      {
        platform: "Android",
        name: "Google Play",
        url: "https://play.google.com/store/apps/details?id=com.kreativ.sharesafe",
      },
    ],
    description:
      "Remove photo metadata before sharing. Clean copies stay on your device; originals stay untouched.",
    features: [
      "Use free Privacy Check to inspect selected EXIF fields before and after cleaning",
      "Remove EXIF location, camera, and timestamp metadata",
      "Replace original filenames with neutral filenames",
      "Choose JPEG quality and export individual files or a ZIP",
      "Save cleaned copies to your gallery or share them",
    ],
    limitation:
      "Metadata removal does not hide faces, visible addresses, or other identifying content in the image. Blur and pixelation can still reveal information. Review each copy before sharing. JPEG export can change quality and does not preserve animation or transparency.",
  },
  {
    slug: "northlight",
    name: "Northlight",
    category: "Compass and light",
    accessLabel: "Free + optional paid Pro",
    privacyUrl: "/privacy/northlight/",
    privacyNote: "No account, ads or analytics. Optional location access is used for the altimeter; coordinates and altitude history are not saved or uploaded.",
    proDescription:
      "Optional Northlight Pro adds up to eight saved magnetic bearings, spoken phone-turn guidance, optional alignment vibration, amber and green screen lights, and an adjustable strobe through a one-time Google Play purchase. Core compass, speech, GPS altitude, lantern, red light and SOS remain free. Your local Pro price is shown before purchase.",
    screenshotWidth: 1080,
    screenshotHeight: 1920,
    stores: [
      {
        platform: "Android",
        name: "Google Play",
        url: "https://play.google.com/store/apps/details?id=com.kreativ.northlight",
      },
    ],
    description:
      "An offline magnetic compass for Android, with spoken headings, optional GPS altitude estimates and practical light tools.",
    features: [
      "Read magnetic headings with a clear degree dial and accuracy feedback",
      "Hear headings using an installed offline voice",
      "Enable GPS altitude estimates with reference and uncertainty labels",
      "Use the LED lantern, adjustable red screen light, SOS and Quick Settings torch tile",
    ],
    limitation:
      "Compass accuracy depends on the phone's sensors and nearby magnetic interference. GPS altitude is approximate; read the displayed reference and vertical uncertainty. Bearing cues describe phone orientation, not routes or safe paths. SOS is a flashing light, not an emergency call. Flash brightness and haptics depend on hardware and Android settings.",
  },
  {
    slug: "paperbuild",
    name: "PaperBuild",
    category: "Document tools",
    accessLabel: "Free + optional paid Pro",
    privacyUrl: "https://github.com/aolaru/kreativ-mobile-apps/blob/main/paperbuild/PRIVACY_POLICY.md",
    privacyNote: "Documents are processed on-device without an account, advertising or uploads. The app has no internet permission; Google Play handles optional purchases.",
    description: "Turn photos and scans into a PDF, with private on-device drafts and a library of recent documents.",
    proDescription: "The free PDF maker supports up to 10 pages. Optional one-time Pro unlocks unlimited pages, smaller exports, merge and extract tools, output passwords, watermarks, page numbers and reusable presets. Your local price is shown in Google Play before purchase.",
    screenshotWidth: 1080,
    screenshotHeight: 2340,
    stores: [{platform: "Android", name: "Google Play", url: "https://play.google.com/store/apps/details?id=com.kreativ.paperbuild"}],
    features: ["Capture or select images, then crop, rotate and reorder pages", "Export A4 or US Letter PDFs in colour, grayscale or high contrast", "Resume a saved draft and find, rename or share Recent PDFs"],
    limitation: "Password-protected input PDFs require an unlocked copy. Editing a signed PDF invalidates its signature. Watermarks do not redact sensitive content; keep exported copies before uninstalling.",
  },
  {
    slug: "kreativ-font",
    name: "Kreativ Font",
    category: "Font discovery",
    accessLabel: "Free",
    privacyUrl: "https://kreativfont.com/blog/terms-of-use-privacy-policy",
    privacyNote: "Catalog searches are sent to kreativfont.com. Favorites and searches within favorites stay on the device. The official store listing and linked privacy policy describe data handling.",
    description: "Browse and search the Kreativ Font catalogue, inspect typeface previews and save favorites on your Android phone.",
    proDescription: "The font-discovery app is free. Font purchases and downloads are handled by linked websites under their own prices and licenses.",
    screenshotWidth: 1080,
    screenshotHeight: 2340,
    stores: [{platform: "Android", name: "Google Play", url: "https://play.google.com/store/apps/details?id=com.kreativ.fontapp"}],
    features: ["Browse commercial and free font articles in separate feeds", "Search the website catalogue with All, Commercial and Free filters", "Zoom preview images and save favorites without an account"],
    limitation: "This is a discovery app, not a font installer or editor. It does not change your phone's system font. Catalogue search and opening articles need internet; check each font's license before use.",
  },
];
