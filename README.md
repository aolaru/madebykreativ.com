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

## Redirects

GitHub Pages serves static files and cannot return custom HTTP `301` responses. The legacy routes therefore retain accessible `noindex` compatibility pages for the current deployment. The `_redirects` manifest activates real permanent redirects if the site is moved behind Cloudflare Pages or another host that supports the same redirect syntax.
