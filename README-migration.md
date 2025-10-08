
# Static Export Migration

This project has been migrated for **pure static export** using Next.js 14.

## What changed
- `next.config.js` now sets `output: 'export'` and `images.unoptimized: true`.
- `app/[lang]/page.tsx` declares `generateStaticParams()` for `en` and `zh`.
- `app/[lang]/contact/page.tsx` is static (`export const dynamic = 'force-static'`).
- Added `public/` with JSON content used at build/runtime:
  - `public/data/models.json`
  - `public/data/site.json`
  - `public/data/hero.json`
  - `public/data/home_highlights.json`
- Added `public/index.html` to redirect `/` -> `/zh` (replaces middleware).
- Renamed `middleware.ts` to `middleware.ts.disabled` because middleware does not run on static hosting.

## Build static site
```bash
npm i
npm run build:static    # runs: next build && next export
# Output in: out/
```

## Deploy
Upload the **out/** folder to any static host (Nginx, S3+CDN, Netlify, Vercel static, GitHub Pages, etc.).

## Customization
- Edit **public/data/*.json** to update models, hero banner, highlights and contact info.
- If you add more locales, update `generateStaticParams()` accordingly.

_Migration timestamp: 2025-10-07T16:23:46.434551Z_


## 2025-10-08: Removed multi-language routing; site flattened to '/' and '/contact'.
