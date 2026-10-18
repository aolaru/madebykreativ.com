import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import sharp from "sharp";
import { parseDocument, DomUtils } from "htmlparser2";
import { fileURLToPath } from "node:url";

const publicDir = new URL("../public/", import.meta.url);
const apps = [
  {
    slug: "sharesafe",
    id: "com.kreativ.sharesafe",
    title: "ShareSafe",
    subtitle: "Clean photo metadata. Keep your originals.",
  },
  {
    slug: "northlight",
    id: "com.kreativ.northlight",
    title: "Northlight",
    subtitle: "Compass, spoken headings, altitude and light.",
  },
  {
    slug: "paperbuild",
    id: "com.kreativ.paperbuild",
    title: "PaperBuild",
    subtitle: "Photos and scans. One private PDF.",
  },
  {
    slug: "kreativ-font",
    id: "com.kreativ.fontapp",
    title: "Kreativ Font",
    subtitle: "Discover typefaces. Save your favorites.",
  },
];

async function download(url, target) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  await sharp(Buffer.from(await response.arrayBuffer()))
    .png()
    .toFile(fileURLToPath(target));
}

for (const app of apps) {
  const folder = new URL(`apps/${app.slug}/`, publicDir);
  await mkdir(folder, { recursive: true });
  if (process.argv.includes("--refresh-stores")) {
    const listing = `https://play.google.com/store/apps/details?id=${app.id}&hl=en`;
    const response = await fetch(listing, {
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`${listing}: HTTP ${response.status}`);
    const images = DomUtils.getElementsByTagName(
      "img",
      parseDocument(await response.text()),
    );
    const icon = images.find((img) => img.attribs.alt === "Icon image");
    const screen = images.find((img) => img.attribs.alt === "Screenshot image");
    if (!icon || !screen) throw new Error(`Store artwork missing: ${app.slug}`);
    await download(
      icon.attribs.src.replace(/=w\d+-h\d+$/, "=w512"),
      new URL("icon.png", folder),
    );
    // Preserve the real Northlight capture published with its tutorial.
    if (app.slug !== "northlight")
      await download(
        screen.attribs.src.replace(/=w\d+-h\d+$/, "=w1080"),
        new URL("screen.png", folder),
      );
    await writeFile(
      new URL("source.json", folder),
      JSON.stringify(
        {
          listing,
          checked: new Date().toISOString().slice(0, 10),
          icon: icon.attribs.src,
          screenshot:
            app.slug === "northlight"
              ? "Existing real Northlight tutorial capture"
              : screen.attribs.src,
        },
        null,
        2,
      ) + "\n",
    );
  }
  const original = await readFile(new URL("screen.png", folder));
  const size = await sharp(original).metadata();
  console.log(`${app.slug}: ${size.width} x ${size.height}`);
  for (const width of [320, 640, 1080])
    await sharp(original)
      .resize({ width })
      .webp({ quality: 84 })
      .toFile(fileURLToPath(new URL(`screen-${width}.webp`, folder)));
  const screen = await sharp(original)
    .resize({ width: 260, height: 500, fit: "inside" })
    .png()
    .toBuffer();
  const icon = await sharp(await readFile(new URL("icon.png", folder)))
    .resize(80, 80)
    .png()
    .toBuffer();
  const copy = Buffer.from(
    `<svg width="1200" height="630"><rect width="1200" height="630" fill="#f3f6fb"/><text x="80" y="250" fill="#172235" font-family="Arial" font-weight="bold" font-size="72">${app.title}</text><text x="80" y="325" fill="#3f516d" font-family="Arial" font-size="25">${app.subtitle}</text><text x="80" y="550" fill="#236b45" font-family="Arial" font-size="26">Made by Kreativ · Android</text></svg>`,
  );
  await sharp(copy)
    .composite([
      { input: icon, left: 80, top: 80 },
      { input: screen, left: 860, top: 65 },
    ])
    .png()
    .toFile(fileURLToPath(new URL("social.png", folder)));
}

const appIcons = [];
for (const [index, app] of apps.entries())
  appIcons.push({
    input: await sharp(
      await readFile(new URL(`apps/${app.slug}/icon.png`, publicDir)),
    )
      .resize(110, 110)
      .png()
      .toBuffer(),
    left: 80 + index * 160,
    top: 360,
  });
const appsCard = Buffer.from(
  '<svg width="1200" height="630"><rect width="1200" height="630" fill="#f3f6fb"/><text x="80" y="160" fill="#236b45" font-family="Arial" font-size="28">MADE BY KREATIV</text><text x="80" y="255" fill="#172235" font-family="Arial" font-weight="bold" font-size="72">Kreativ Apps</text><text x="80" y="550" fill="#3f516d" font-family="Arial" font-size="27">ShareSafe · Northlight · PaperBuild · Kreativ Font</text></svg>',
);
await sharp(appsCard)
  .composite(appIcons)
  .png()
  .toFile(fileURLToPath(new URL("og-apps.png", publicDir)));

for (const slug of ["sharesafe", "northlight", "paperbuild", "kreativ-font"]) {
  const dir = new URL(`images/${slug}/tutorial/`, publicDir);
  for (const name of await readdir(dir))
    if (name.endsWith(".png")) {
      for (const width of [480, 960])
        await sharp(await readFile(new URL(name, dir)))
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 86 })
          .toFile(
            fileURLToPath(new URL(name.replace(".png", `-${width}.webp`), dir)),
          );
    }
}
