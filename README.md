# Ayurvedic Wellness Centre — Website

A complete redesign and rebuild of [ayurvedicwellnesscentre.com.au](https://www.ayurvedicwellnesscentre.com.au)
on **Astro**, migrated from WordPress (Elementor + WooCommerce).

## Design

"Sacred Modern Editorial" — a luxury wellness brand-book on warm paper. The brand
fundamentals are preserved exactly; the expression around them is new.

- **Colours** (locked, from the live Elementor theme): wine `#780032`, navy ink `#00324E`,
  gold `#FDC578`, espresso `#331703`, taupe `#74623C`, mushroom `#B19B87`, on warm ivory `#FBF6EE`.
- **Type** (locked): **Sorts Mill Goudy** (display serif) + **Montserrat** (UI/body).
- **Logo** preserved as-is. Decorative flame ornaments derive from its linework.

Design tokens live in `src/styles/tokens.css`; the editorial prose system in `src/styles/global.css`.

## Content

All 369 WordPress items were migrated via the WordPress REST API into Astro content
collections (`src/content/`), with full SEO metadata preserved verbatim (titles, meta
descriptions, canonicals, Open Graph, and original Yoast JSON-LD in `src/data/seo/`).
URLs are preserved 1:1 so no link equity is lost. ~1,550 media files were localised
into `public/wp-content/`.

| Collection | Count |
|---|---|
| blog (posts) | 184 |
| pages | 64 |
| services | 55 |
| products | 52 |
| doctors | 2 |
| testimonials | 12 |

## Develop

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static output -> dist/
npm run preview
```

### Re-running the migration scripts (Python 3)

```bash
npm run fetch:images          # download/localise referenced media
python3 scripts/clean_content.py   # tidy migrated markdown bodies
```

## Architecture

- `src/layouts/BaseLayout.astro` — SEO `<head>`, header, footer, scroll-reveal
- `src/layouts/ContentLayout.astro` — shared article shell (services, posts, pages, doctors, products)
- `src/components/` — Header, Footer, cards, ornaments, section headers
- `src/pages/` — homepage, `[...slug]` (posts + pages), `services/`, `doctor/`, `product/`,
  and designed index pages (`treatments/`, `conditions/`, `journal/`, `shop/`, `team/`)

## Not yet wired (intentional next steps)

- **Commerce**: products are migrated as content pages; cart/checkout needs a decision
  (headless WooCommerce, Shopify/Snipcart, or payment links).
- **Booking widget** + **forms** (Dosha quiz, contact) need a backend / embed.
- Domain cutover + 301 verification at go-live.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
