import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { parseDocument, DomUtils } from "htmlparser2";
import { selectedServiceWork } from "../src/data/services.ts";

const publicDir = new URL("../public/", import.meta.url);
const folder = new URL("services/", publicDir);
await mkdir(new URL("work/", folder), { recursive: true });
const provenance = [];
const checked = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Bucharest",
}).format(new Date());

async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response;
}

for (const work of selectedServiceWork.filter((item) =>
  item.image.startsWith("/services/"),
)) {
  const target = new URL(work.image.slice(1), publicDir);
  let exists = true;
  try {
    await access(target);
  } catch {
    exists = false;
  }
  if (exists && !process.argv.includes("--refresh")) continue;
  let source;
  if (work.category === "WordPress plugin") {
    const slug = new URL(work.href).pathname.split("/").filter(Boolean).at(-1);
    const api = new URL("https://api.wordpress.org/plugins/info/1.2/");
    api.searchParams.set("action", "plugin_information");
    api.searchParams.set("request[slug]", slug);
    const plugin = await (await get(api)).json();
    if (plugin.name !== work.name)
      throw new Error(`Unexpected plugin: ${slug}`);
    source =
      plugin.screenshots?.[work.id === "report-broken-link" ? "2" : "1"]?.src;
  } else {
    const doc = parseDocument(await (await get(work.href)).text());
    const icon = DomUtils.getElementsByTagName("img", doc).find(
      (node) => node.attribs.alt === `Item logo image for ${work.name}`,
    );
    source = icon?.attribs.src.replace(/=s\d+$/, "=s256");
  }
  if (!source) throw new Error(`Official artwork unavailable: ${work.name}`);
  const image = sharp(Buffer.from(await (await get(source)).arrayBuffer()));
  await image
    .resize({
      width: work.width,
      height: work.height,
      fit: "contain",
      background: work.imageKind === "logo" ? "#0000" : "#edf1f6",
    })
    .webp({ quality: 86 })
    .toFile(fileURLToPath(target));
  provenance.push({
    project: work.name,
    listing: work.href,
    source,
    asset: work.image,
    checked,
  });
}
if (provenance.length) {
  let existing = [];
  try {
    existing = JSON.parse(
      await readFile(new URL("sources.json", folder), "utf8"),
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const records = new Map(
    [...existing, ...provenance].map((record) => [record.asset, record]),
  );
  await writeFile(
    new URL("sources.json", folder),
    JSON.stringify([...records.values()], null, 2) + "\n",
  );
}

const report = await sharp(
  await readFile(new URL("services/work/report-broken-link.webp", publicDir)),
)
  .resize(640, 400)
  .toBuffer();
const imageFinder = await sharp(
  await readFile(new URL("services/work/broken-image-finder.webp", publicDir)),
)
  .resize(430, 269)
  .toBuffer();
const shareSafe = await sharp(
  await readFile(new URL("apps/sharesafe/screen-640.webp", publicDir)),
)
  .resize({ height: 320 })
  .toBuffer();
const northlight = await sharp(
  await readFile(new URL("apps/northlight/screen-640.webp", publicDir)),
)
  .resize({ height: 320 })
  .toBuffer();
await sharp({
  create: { width: 1440, height: 640, channels: 4, background: "#0000" },
})
  .composite([
    { input: report, left: 0, top: 240 },
    { input: shareSafe, left: 665, top: 320 },
    { input: northlight, left: 855, top: 280 },
    { input: imageFinder, left: 1010, top: 371 },
  ])
  .webp({ quality: 84 })
  .toFile(fileURLToPath(new URL("hero-work.webp", folder)));

const brand = await sharp(await readFile(new URL("favicon.svg", publicDir)))
  .resize(62, 62)
  .png()
  .toBuffer();
const reportPreview = await sharp(report).resize(490, 306).png().toBuffer();
const phonePreview = await sharp(shareSafe)
  .resize({ height: 330 })
  .png()
  .toBuffer();
const copy = Buffer.from(
  '<svg width="1200" height="630"><rect width="1200" height="630" fill="#f3f6fb"/><text x="155" y="110" fill="#176840" font-family="Arial" font-size="26">MADE BY KREATIV</text><text x="70" y="230" fill="#172235" font-family="Arial" font-size="64" font-weight="bold">Custom Software.</text><text x="70" y="310" fill="#172235" font-family="Arial" font-size="64" font-weight="bold">Built and Tested.</text><text x="70" y="395" fill="#3f516d" font-family="Arial" font-size="24">WordPress · Chrome extensions · Android</text><text x="70" y="438" fill="#3f516d" font-family="Arial" font-size="24">Web tools · Software QA · API automation</text><text x="70" y="560" fill="#176840" font-family="Arial" font-size="25">madebykreativ.com/services/</text></svg>',
);
await sharp(copy)
  .composite([
    { input: brand, left: 70, top: 62 },
    { input: reportPreview, left: 660, top: 300 },
    { input: phonePreview, left: 1000, top: 270 },
  ])
  .png()
  .toFile(fileURLToPath(new URL("og-services.png", publicDir)));
console.log(
  "Prepared official service portfolio artwork, hero proof strip and social image.",
);
