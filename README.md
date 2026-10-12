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

Browser checks use the installed Google Chrome locally and Playwright Chromium in CI.
They visit every generated non-redirect page at mobile and desktop widths, check
light/dark accessibility with axe, and verify images, comparison prices, Updates
filtering, attribution, and free-package SHA-256 hashes. CI installs Chromium first.

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
The sitemap uses per-page dates; unknown dates are omitted rather than guessed.

## Storefront Health And Attribution

`npm run validate:storefronts` checks all six public Gumroad listings with bounded
timeouts and retries. A separate weekly/manual GitHub Action runs it without
blocking deployments on temporary external outages. It tests public availability,
not authenticated delivery files or a purchase transaction.

Gumroad CTAs carry anonymous `utm_source`, `utm_medium`, `utm_campaign`, and
page/position `utm_content` labels. Plausible counts **Product CTA Click** events;
these are not purchases. Evaluate checkout outcomes in Gumroad's own sales and
referrer reporting, where available. No buyer identity is sent to site analytics,
and no cross-domain revenue integration is configured. Production analytics are
disabled on localhost and respect browser GPC/Do Not Track signals.

## Redirects

GitHub Pages serves static files and cannot return custom HTTP `301` responses. The legacy routes therefore retain accessible `noindex` compatibility pages for the current deployment. The `_redirects` manifest activates real permanent redirects if the site is moved behind Cloudflare Pages or another host that supports the same redirect syntax.
