# NOVEL

A premium home & lifestyle e-commerce flagship — kitchen essentials, macramé, rugs, home decor, tableware, textiles and gifts — with a full admin dashboard for managing the storefront's content.

## Stack

- **Next.js 16** (App Router, TypeScript, dynamic/SSR rendering)
- **Tailwind CSS v4** — design tokens defined in `src/app/globals.css`
- **Supabase** — Postgres database, Auth (admin login), and Storage (product images)
- **React Context** for cart and wishlist state, persisted to `localStorage`

See **`DEPLOYMENT.md`** for hosting, environment variables, admin login
details, and how to change the admin password — read that before deploying.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + anon key
npm run dev
```

Visit `http://localhost:3000` for the storefront, `http://localhost:3000/admin` for the dashboard.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Project structure

```
src/
  app/
    (storefront)/      public routes: home, shop, product, cart, checkout, wishlist, about, contact, journal
    admin/
      login/            admin sign-in (public)
      (dashboard)/      everything behind auth: overview, products, categories, journal, homepage content, settings, contact submissions, newsletter
    actions.ts          server actions for the public contact/newsletter forms
  proxy.ts              Next.js Proxy (formerly "middleware") — protects /admin/*
  components/           shared storefront UI (Header, Footer, ProductCard, CartDrawer, SearchOverlay, ...)
  components/home/      homepage-only sections
  components/product/   product detail page pieces
  components/shop/      shop/category filtering UI
  context/               CartContext, WishlistContext
  lib/
    supabase/            browser + server Supabase clients
    products.ts, categories.ts, journal.ts, homepage.ts, settings.ts, submissions.ts   — the data layer (all DB-backed)
    types.ts             shared TypeScript types
```

## Content management

Everything a store admin needs to change day-to-day is editable from
`/admin` — no code changes or redeploys required:

- Products (details, pricing, stock, variants, images, featured/best-seller/new-arrival flags, SEO)
- Categories
- Journal posts
- Homepage copy (hero, featured collection, editorial section, brand story)
- Site settings (contact info, social links, default SEO)
- Contact form submissions and newsletter subscribers

## Imagery

No real product photography was supplied for this build, so every image
slot renders through `src/components/EditorialImage.tsx` — a warm-toned
placeholder graphic — **until a real photo is uploaded** from the admin
product page. Once uploaded, `EditorialImage` automatically switches to
rendering the real photo via `next/image`. This is intentional, documented
behavior, not a missing feature.

## Logo

`src/components/Logo.tsx` renders a wordmark placeholder standing in for
the brand's official logo asset — no logo file was provided in this build.
Drop the real mark in and swap the component's internals; header/footer
layout doesn't need to change.

## License

MIT
