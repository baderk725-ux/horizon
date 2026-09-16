# NOVEL

A premium home & lifestyle e-commerce flagship — kitchen essentials, macramé, rugs, home decor, tableware, textiles and gifts, built as a full Next.js storefront.

## Stack

- **Next.js 16** (App Router, TypeScript, static generation)
- **Tailwind CSS v4** — design tokens defined in `src/app/globals.css`
- **React Context** for cart and wishlist state, persisted to `localStorage`
- No backend yet — product, category and journal data lives in `src/lib/` as a clean, typed layer ready to be swapped for a real CMS/commerce API

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Project structure

```
src/
  app/                 routes (App Router): home, shop, product, cart, checkout, wishlist, about, contact, journal
  components/          shared UI (Header, Footer, ProductCard, CartDrawer, SearchOverlay, ...)
  components/home/     homepage-only sections (Hero, CategoryTile, EditorialSplit, ProductRail)
  components/product/  product detail page pieces (gallery, info, accordion)
  components/shop/     shop/category filtering UI
  context/             CartContext, WishlistContext
  lib/                 typed data layer: products, categories, journal posts, formatting helpers
```

## Imagery

No product photography was supplied, so every image slot renders through
`src/components/EditorialImage.tsx` — a deterministic, tasteful placeholder
(warm gradient + line icon) that keeps consistent aspect ratios everywhere.
Swap it for real photography by replacing the `<EditorialImage>` usages with
`next/image`, using the same `alt` text already threaded through the data
layer in `src/lib/products.ts`.

## Logo

`src/components/Logo.tsx` renders a wordmark placeholder standing in for the
brand's official logo asset. Drop the real mark in and swap the component's
internals — the header/footer layout doesn't need to change.

## License

MIT
