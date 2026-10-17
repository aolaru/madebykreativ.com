export interface KreativApp {
  slug: string;
  name: string;
  description: string;
  category: string;
  accessLabel: string;
  proDescription: string;
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
    slug: "sharesafe",
    name: "ShareSafe",
    category: "Photo privacy",
    accessLabel: "Free + optional paid Pro",
    proDescription:
      "Optional ShareSafe Pro adds manual Cover, blur, and pixelation tools through a one-time Google Play purchase. Metadata cleaning stays free. Your local Pro price is shown before purchase.",
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
      "Remove EXIF location, camera, and timestamp metadata",
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
    proDescription:
      "Optional Northlight Pro adds up to eight saved magnetic bearings, spoken phone-turn guidance, optional alignment vibration, amber and green screen lights, and an adjustable strobe through a one-time Google Play purchase. Core compass, speech, GPS altitude, lantern, red light and SOS remain free. Your local Pro price is shown before purchase.",
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
];
