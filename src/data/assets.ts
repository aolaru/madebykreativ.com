import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const sharedAssetPaths = ["/style.css", "/site.js"] as const;

export function assetVersion(content: string | Uint8Array) {
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
}

export function versionedPublicAsset(path: (typeof sharedAssetPaths)[number]) {
  const content = readFileSync(join(process.cwd(), "public", path.slice(1)));
  return `${path}?v=${assetVersion(content)}`;
}
