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
      "Optional Northlight Pro adds saved bearings, amber and green screen lights, and an adjustable flash strobe through a one-time Google Play purchase. The core compass, lantern, red light, and SOS stay free. Your local Pro price is shown before purchase.",
    screenshotHeight: 2340,
    stores: [
      {
        platform: "Android",
        name: "Google Play",
        url: "https://play.google.com/store/apps/details?id=com.kreativ.northlight",
      },
    ],
    description:
      "An offline magnetic compass, LED lantern, red-light screen, and SOS light for Android.",
    features: [
      "Magnetic compass with accuracy feedback",
      "Adjustable LED lantern on supported devices",
      "Red-light screen, SOS signal, and Quick Settings torch tile",
    ],
    limitation:
      "Compass accuracy depends on your phone's sensors and nearby magnetic interference. Flash brightness varies by device. SOS is a flashing light, not an emergency call or a substitute for dedicated safety equipment.",
  },
];
