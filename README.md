# NOVEL Household

Production e-commerce platform for **NOVEL Household** (نوڤل هاوسهولد) — a premium household-products brand. Built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase (Postgres + Auth + Storage).

See [`CLAUDE.md`](./CLAUDE.md) for the engineering standards this project follows.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4, design tokens in `src/app/globals.css`
- **i18n:** `next-intl` — Arabic (default, RTL) and English (LTR), locale-prefixed routes (`/ar`, `/en`)
- **Backend:** Supabase (Postgres with RLS, Auth, Storage) — project `Novel household`

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase URL/anon key
npm run dev
```

## Project structure

```
src/
  app/[locale]/        Locale-scoped routes (storefront + future admin)
  components/ui/        Design-system primitives (Button, Container, ...)
  components/storefront/ Storefront-specific components
  i18n/                  next-intl routing/navigation config
  lib/supabase/          Supabase client (browser + server) and generated DB types
  lib/data/              Typed data-access functions (Supabase queries)
  proxy.ts               Locale routing + Supabase session refresh (Next 16 "proxy")
messages/                Arabic/English UI strings
```

## Status

This is being built feature-by-feature per the priority order in `CLAUDE.md`. See project tracking for current phase.
