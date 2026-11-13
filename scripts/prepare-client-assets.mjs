import sharp from "sharp";
import { readdir } from "node:fs/promises";
import { apps } from "../src/data/apps.ts";

const root = new URL("../public/", import.meta.url);
for (const app of apps) {
  for (const width of [56, 112])
    await sharp(new URL(`apps/${app.slug}/icon.png`, root).pathname)
      .resize(width, width)
      .webp({ quality: 85 })
      .toFile(new URL(`apps/${app.slug}/icon-${width}.webp`, root).pathname);
  await sharp(new URL(`apps/${app.slug}/screen.png`, root).pathname)
    .resize({ width: 160 })
    .webp({ quality: 84 })
    .toFile(new URL(`apps/${app.slug}/screen-160.webp`, root).pathname);
}
const covers = new URL("product-to-profit/covers/", root);
for (const file of await readdir(covers)) {
  if (!file.endsWith(".png")) continue;
  await sharp(new URL(file, covers).pathname)
    .resize({ width: 300 })
    .webp({ quality: 84 })
    .toFile(new URL(file.replace(/\.png$/, "-300.webp"), covers).pathname);
}
for (const name of ["report-broken-link", "broken-image-finder"]) {
  for (const width of [320, 640])
    await sharp(new URL(`services/work/${name}.webp`, root).pathname)
      .resize({ width })
      .webp({ quality: 84 })
      .toFile(new URL(`services/work/${name}-${width}.webp`, root).pathname);
}
console.log(
  "Generated compact app icons, screenshots, covers and WordPress previews.",
);
