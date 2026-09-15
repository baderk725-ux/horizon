# NOVEL Household

Production e-commerce platform for **NOVEL Household** (نوفِل) — a premium household-products brand serving Jordan. Storefront + a full internal admin panel, built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase (Postgres + Auth + Storage).

See [`CLAUDE.md`](./CLAUDE.md) for the engineering standards this project follows.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4, design tokens in `src/app/globals.css`, runtime-overridable via the admin Theme Editor
- **i18n:** `next-intl` — Arabic (default, RTL) and English (LTR), locale-prefixed routes (`/ar`, `/en`)
- **Backend:** Supabase (Postgres with RLS as the real security boundary, Auth, Storage)
- **Payments:** Cash on delivery (COD) only — no card/online payment integration exists or is implied anywhere in the codebase

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project's values
npm run dev
```

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint --max-warnings=0
npx tsc --noEmit
```

## Environment variables

See [`.env.example`](./.env.example) for the full list with descriptions. Summary:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | The **publishable/anon** key — never the `service_role` key. This app has no server-only Supabase client anywhere; every request relies on RLS, by design. |
| `NEXT_PUBLIC_SITE_URL` | Recommended in production | Absolute origin (e.g. `https://novelhousehold.com`), used for `sitemap.xml`, `robots.txt`, and the password-reset email link. Falls back to `http://localhost:3000` if unset. |

No `service_role` key, password, or access token is used or required anywhere in this application. If one is ever introduced, it must stay server-only and never be prefixed `NEXT_PUBLIC_`.

## Database & migrations

The Supabase project backing this app already has its full schema (~45 migrations: products, orders, payments, RLS policies, etc.) applied directly against the live project. Historically none of those were mirrored into this repository.

Starting with this delivery, **new** schema/RLS changes are tracked as SQL files under [`supabase/migrations/`](./supabase/migrations/), named `<UTC timestamp>_<description>.sql`, matching the Supabase CLI convention. Currently:

- `20260914220103_close_direct_order_insert_rls_hole.sql` — closes an RLS hole that let any client insert directly into `orders`/`order_items`, bypassing the `create_order()` RPC. Safe to re-run (`DROP POLICY IF EXISTS`).

To point this app at a **different** Supabase project, you would need to fully provision its schema first — this repo alone is not sufficient to stand up a new backend from scratch, since most of the schema predates local migration tracking. Talk to whoever manages the Supabase project for a schema dump if you need to do this.

## Project structure

```
src/
  app/[locale]/(storefront)/   Storefront pages (shop, product, cart, checkout, faq, policies, ...)
  app/[locale]/(auth)/         Sign in/up, forgot/reset password
  app/[locale]/admin/          Admin panel (protected route group + /login)
  app/sitemap.ts, robots.ts    SEO
  app/auth/callback/           Password-reset email link handler
  components/ui/               Design-system primitives (Button, Container, Input, ...)
  components/storefront/       Storefront-specific components
  components/admin/            Admin-specific components
  components/auth/             Auth forms
  i18n/                        next-intl routing/navigation config
  lib/supabase/                Supabase client (browser + server) + generated DB types
  lib/data/                    Typed read queries (storefront + admin/*)
  lib/actions/                 Server Actions (all writes go through these)
  lib/theme/                   Theme Editor color-scale derivation
  lib/validation/              Zod schemas
  proxy.ts                     Locale routing + Supabase session refresh (Next 16 "proxy" = middleware)
messages/                      Arabic/English UI strings (next-intl)
supabase/migrations/           New schema/RLS changes only (see above)
```

## Features / routes

**Storefront:** homepage, `/shop` (search, category filter, sort, pagination), `/categories`, `/collections`, `/collection/[slug]`, `/product/[slug]`, `/faq`, `/policies`, `/contact`, `/cart`, `/checkout` (guest or signed-in), `/order-confirmation`, `/account` (profile, orders, wholesale application), `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`.

**Admin (`/admin`, all gated by role + RLS, not just UI):** dashboard, orders, payments, returns, discounts/coupons, bundles, customers (CRM), wholesale accounts, inventory, suppliers, purchase orders, finance/expenses, payroll (simple salary ledger, not a tax engine), reports, analytics, product reviews moderation, content/CMS (site text + FAQs), collections, categories, products, shipping (governorates/delivery areas), staff/roles, store settings, **Theme Editor** (primary/accent brand colors, full palette derived automatically to protect text contrast).

## Security model

- **RLS is the only real access boundary.** The anon key is meant to be public; every table's Postgres Row-Level Security policy — not application code — decides who can read or write what. Application-layer `isAdmin()` checks exist only as UX (hide a button before the request even goes out), never as the actual gate.
- Orders/payments/prices are never trusted from the client: `create_order()` (a `SECURITY DEFINER` Postgres function) computes totals, validates stock, and is the *only* path that can create an order or its payment record — direct table writes to `orders`/`order_items`/`payments` are blocked by RLS for every role except staff-gated updates.
- See `CLAUDE.md` and this session's audit history (commit messages on `main`/this branch) for the full list of real-DB security tests performed.

## Known, deliberate gaps (not bugs — documented product decisions)

- **`product_variants`** — the table exists in the schema but is completely unused (0 rows, no app code references it). Building size/color variant selection is a multi-surface feature (cart, checkout, stock-per-variant) that needs its own design pass, not a quick addition.
- **Bundle checkout** — bundles are a real, fully-functional admin catalog feature, but a customer cannot buy one yet: `cart_items` has no `bundle_id` column and `create_order()`'s item schema has no way to reference a bundle. Wiring this up means deciding how a bundle's price is allocated across its component `order_items` for accounting — a product decision, not implemented.
- **Stock reservation at order creation** — `create_order()` checks `stock_quantity` at the moment of order creation but does not reserve/decrement it; actual decrement happens only when staff moves an order to `confirmed`. This is intentional for a COD storefront (unconfirmed/possibly-fake orders shouldn't lock real inventory), and a hard database `CHECK` constraint guarantees stock can never go negative regardless. The trade-off: two customers can both successfully place an order for the last unit of something, and the second one will fail to *confirm* later with a generic error rather than being caught at checkout. Fixing this properly means deciding on a reservation/expiry model for pending orders — a product decision, not implemented.
- **`site_content.contact_email` / `contact_phone`** — left editable in the CMS but intentionally not wired into the storefront `/contact` page, which already reads the authoritative `store_settings.support_email` / `support_phone` instead. Wiring the `site_content` copies up would create two conflicting sources of truth.

## Deployment checklist

1. Set `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` for the target Supabase project.
2. Set `NEXT_PUBLIC_SITE_URL` to the real production domain (affects `sitemap.xml`, `robots.txt`, and the password-reset email link).
3. In the Supabase dashboard, confirm `supabase/migrations/20260914220103_close_direct_order_insert_rls_hole.sql` is applied (it already is on the project this was built against — only relevant if you're provisioning a *new* project from a schema dump).
4. Consider enabling **Leaked Password Protection** under Authentication → Policies in the Supabase dashboard (flagged by Supabase's own security advisor; not a code change, an Auth-service setting).
5. `npm run build` and deploy the standard Next.js output to your host of choice (Vercel, or any Node host that supports Next.js 16).
