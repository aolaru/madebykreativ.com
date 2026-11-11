import { Parser } from "htmlparser2";
import { assetVersion, sharedAssetPaths } from "../src/data/assets.ts";

const origin = "https://madebykreativ.com";

export function sharedAssetReferences(html) {
  const references = new Map();
  const parser = new Parser({
    onopentag(name, attributes) {
      const source = name === "link" && attributes.rel === "stylesheet"
        ? attributes.href
        : name === "script" ? attributes.src : undefined;
      if (!source) return;
      const url = new URL(source, origin);
      if (sharedAssetPaths.includes(url.pathname)) {
        if (url.origin !== origin || !/^[a-f0-9]{16}$/.test(url.searchParams.get("v") || ""))
          throw new Error(`${url.pathname}: missing content-based asset version`);
        if (references.has(url.pathname))
          throw new Error(`${url.pathname}: duplicate shared asset reference`);
        references.set(url.pathname, url);
      }
    },
  });
  parser.end(html);
  for (const path of sharedAssetPaths)
    if (!references.has(path)) throw new Error(`${path}: missing shared asset reference`);
  return references;
}

export function verifyAssetVersion(url, content) {
  if (url.searchParams.get("v") !== assetVersion(content))
    throw new Error(`${url.pathname}: cached content does not match its version`);
}
