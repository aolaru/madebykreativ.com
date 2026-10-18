# madebykreativ.com

Astro-based static site for the Kreativ ecosystem.

## Live site

- https://madebykreativ.com

## Contents

- `src/layouts` - shared page layout
- `src/components` - shared site components
- `src/pages` - Astro pages that build to the current `.html` routes
- `public/style.css` - shared site styles
- `public/site.js` - shared behavior for theme, footer year, and analytics events
- `public/` - static assets, icons, social images, `robots.txt`, and `CNAME`
- `public/_redirects` - permanent redirect rules for redirect-capable static hosts such as Cloudflare Pages
- `scripts/check-built-site.mjs` - production artifact checks for required routes, assets, canonicals, sitemap entries, and the custom domain
- `astro.config.mjs` - Astro configuration
- `package.json` - local scripts and Astro dependency

## Local preview

Use Node.js 24 and install the locked dependencies:

```bash
nvm use
npm ci
npm run dev
```

Build the production output with:

```bash
npm run build
```

Run the complete production quality gate with:

```bash
npm run check
```

The same check runs for pull requests and before every GitHub Pages deployment.

Browser checks use the same pinned Playwright Chromium locally and in CI.
Install it once with `npx playwright install --only-shell chromium`.
An explicit `PLAYWRIGHT_CHANNEL=chrome` override can use a system Chrome instead.
Install Firefox/WebKit with `npx playwright install firefox webkit` and run the
optional local `npm run validate:cross-browser` for the additional smoke suite.
They visit every generated non-redirect page at mobile and desktop widths, check
light/dark accessibility with axe, and verify images, comparison prices, Updates
filtering, attribution, and free-package SHA-256 hashes. A focused Firefox/WebKit
suite also covers keyboard navigation, sharing, update history, app support and
narrow mobile layouts. CI installs all three engines and runs both scripts.

`npm run validate:performance` starts an isolated local production preview and
runs mobile Lighthouse budgets on six current routes. Results are saved in
`.lighthouse/` and retained as CI artifacts. `lighthouse.config.mjs` owns the routes
and thresholds. Performance checks run after browser tests, not concurrently.

## Releases And Updates

`src/data/productReleases.json` records verified package versions, PDF versions,
page/field counts, file counts, preview dimensions, and free-package hashes.
Import an approved release with `python3 scripts/sync-product-assets.py SOURCE_ROOT`
(requires Pillow, pypdf, and Poppler's `pdftoppm`). Review the product copy and preview
page selections when changing versions. The importer publishes only the two free
ZIPs and selected preview pages, never complete paid packages. Legacy free ZIP URLs
serve the same current content as their versioned replacements.

News announcements and website change records share `/updates/`. Existing
`/news/<slug>/` articles keep their addresses; `/news/`, `news.html`, and `posts.html`
forward to Updates. Both RSS addresses serve the combined archive with stable GUIDs.
The sitemap and article modification metadata use source Git history; CI checks
out full history. An explicit article `modifiedDate` can override that history.
Unknown dates are omitted rather than guessed or replaced with the build date.

## Storefront Health And Attribution

`npm run validate:storefronts` checks all six public Gumroad listings with bounded
timeouts and retries, including their published state, base EUR prices and release
specifications. `src/data/storefronts.json` supplies the base prices used by both
the website and monitor. It reads Gumroad's product currency and minor-unit price,
not its converted buyer-currency display. Google Play links from the source catalogue
are checked too. Private delivered files and purchase transactions are not tested.

The weekly/manual Storefront Health action also runs `npm run validate:production`
to check live pages, XML feeds, HTTP redirection and both HTTPS hostnames. Deploy
smoke checks verify both hostnames, including a real `301` from `www` that preserves
the path and query string. The independent weekly/manual monitor also passes
`--redirects` to check every legacy URL over HTTP and HTTPS. External store outages
do not block deployment.

Gumroad CTAs carry anonymous `utm_source`, `utm_medium`, `utm_campaign`, and
page/position `utm_content` labels. Plausible counts **Product CTA Click** events;
these are not purchases. Evaluate checkout outcomes in Gumroad's own sales and
referrer reporting, where available. No buyer identity is sent to site analytics,
and no cross-domain revenue integration is configured. Production analytics are
disabled on localhost and respect browser GPC/Do Not Track signals.

Google Play links include an encoded Install Referrer campaign. Plausible records
**App Store Click** with the package ID, page and placement, never support-form
contents. These are outbound clicks, not installs or purchases; use Play Console
acquisition and conversion reports for downstream results. Share events contain
only the canonical page URL, with arbitrary query strings and fragments removed.
Displaying custom events in Plausible requires the matching custom goal in that
account; repository tests do not verify dashboard configuration. Google Play
referrer attribution works independently of that optional reporting dashboard.

## Web Assets And App Support

The Apps catalogue includes ShareSafe, Northlight, PaperBuild and Kreativ Font.
Their published store and privacy links are defined in `src/data/apps.ts`.
Official store artwork provenance is recorded in each `public/apps/*/source.json`.
Run `npm run assets:web` to regenerate responsive WebP screenshots and app social
images from the originals. `npm run assets:web -- --refresh-stores` also downloads
the current official store artwork; review the resulting screenshots and update
their dimensions in the catalogue when needed. The existing real Northlight
capture is preserved. Project reference screenshots were refreshed October 17,
2026. The public bundle workspace image is a read-only crop of the actual v2.2
master dashboard, not a full paid-workbook download or a customer result.

App support at `/apps/support/` composes an email locally. Reports are not uploaded,
saved in browser storage, or sent to analytics. Without JavaScript the page offers
a direct support email link.

## Redirects

GitHub Pages is still the static origin and deployment target. GitHub's certificate
for `www` was activated and its HTTPS `301` verified on October 18, 2026. The `www`
CNAME points to `aolaru.github.io`; the canonical hostname remains `madebykreativ.com`.
Keep GitHub's HTTPS enforcement enabled.

Cloudflare's free DNS/proxy setup was activated October 18, 2026, using
`ken.ns.cloudflare.com` and `mary.ns.cloudflare.com`. Its Universal SSL certificate
is active, and the four apex A records and `www` CNAME are proxied. Cloudflare is
configured for **Full (Strict)** origin TLS,
Always Use HTTPS, and TLS 1.2 minimum. Never use Flexible mode or disable certificate
validation as a workaround. The `info@` forward was recreated in Cloudflare Email
Routing with the same verified destination. Mail uses Cloudflare's three MX records
and its SPF/DKIM records. The Google verification TXT and Domain Connect TXT were
preserved. Do not remove the original WordPress forward while older DNS caches
still use it. Old resolver caches may temporarily serve GitHub directly during
nameserver propagation, so keep the compatibility pages intact.

`public/_redirects` is the source of truth for legacy routes. Run
`npm run redirects:export` to regenerate `infrastructure/cloudflare-redirects.csv`,
then import it into the Cloudflare Bulk Redirect List `madebykreativ_legacy_urls`.
The enabled rule is **Made by Kreativ legacy URLs**. It covers 14 exact paths on
both hostnames (28 entries), including slashless legacy URLs. It preserves query
strings and does not match other subdomains or descendants such as `/news/<slug>/`.
The CSV has no header, per Cloudflare's import format.

`npm run validate:redirects` tests the manifest and detects a stale CSV. Run
`npm run validate:production -- --redirects` to require one-hop HTTP `301` responses
and preserved queries for all 28 legacy URLs over both HTTP and HTTPS (56 checks).
All 56 were verified directly against Cloudflare's edge with certificate validation
on October 18, 2026. Ordinary DNS-based checks also depend on resolver propagation.
Static `noindex` compatibility pages remain as a fallback for direct origin access;
they are not a substitute for the edge redirects. If Cloudflare HTTPS breaks,
temporarily set only the four apex A records and the `www` CNAME to DNS only.
Keep the Cloudflare nameservers and email records intact to avoid disrupting mail.
