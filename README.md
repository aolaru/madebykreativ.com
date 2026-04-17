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
- `public/` - static assets, icons, social images, `robots.txt`, `sitemap.xml`, and `CNAME`
- `astro.config.mjs` - Astro configuration
- `package.json` - local scripts and Astro dependency

## Local preview

Install dependencies and run Astro locally:

```bash
npm install
npm run dev
```

Build the production output with:

```bash
npm run build
```
