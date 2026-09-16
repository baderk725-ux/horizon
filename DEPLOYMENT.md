# NOVEL — Deployment & Admin Guide

This is a beginner-friendly walkthrough for deploying NOVEL and running its
admin dashboard. Read this before you deploy.

## Why this can't be a single `index.html` file

The original brief mentions wanting a standalone deployable `index.html`.
That's not possible here **without losing real functionality**, because:

- The **admin dashboard** requires authentication, database reads/writes,
  and file uploads — none of which a static HTML file can do on its own.
- **Product, category, journal and homepage content** live in a real
  database so the admin can edit them and see changes reflect immediately,
  without a developer rebuilding the site.
- **Contact and newsletter forms** write to the database.

Faking a static export would mean either breaking all of the above, or
shipping your database credentials inside public HTML/JS where anyone could
read and abuse them. Neither is acceptable, so instead this ships as a full
Next.js application (server-rendered where it needs to be, cached where it
doesn't) plus a real hosted database. This is also exactly how virtually
every production e-commerce site with an admin panel is built.

## Architecture at a glance

| Piece | Technology | Where it lives |
|---|---|---|
| Frontend + Admin UI | Next.js 16 (App Router, TypeScript, Tailwind) | Your Next.js host (Vercel recommended) |
| Database | Postgres | Supabase project `novel-storefront` |
| Authentication | Supabase Auth (email + password) | Same Supabase project |
| Image storage | Supabase Storage (`product-images` bucket) | Same Supabase project |
| Admin route protection | Next.js Proxy (`src/proxy.ts`) checking the Supabase session | Runs alongside the app |

Supabase is already provisioned and seeded with your current catalog,
categories, and journal posts — you don't need to set it up from scratch,
just connect your deployed app to it (or your own Supabase project if you'd
rather run your own — see "Using your own Supabase project" below).

## 1. Hosting

**Recommended: [Vercel](https://vercel.com)** — it's built by the makers of
Next.js and requires the least configuration.

1. Push this repository to GitHub (if it isn't already).
2. Go to vercel.com → **Add New → Project** → import the repository.
3. Vercel auto-detects Next.js. Leave the build settings as default.
4. Add the environment variables below before the first deploy.
5. Click **Deploy**.

Any other Node.js host that supports Next.js (Netlify, Render, Railway,
your own server with `npm run build && npm run start`) also works — the
environment variables are the same everywhere.

## 2. Environment variables

Copy `.env.example` to `.env.local` for local development, and add the same
two variables in your host's dashboard (Vercel → Project → Settings →
Environment Variables) for production:

```
NEXT_PUBLIC_SUPABASE_URL=https://cggojpxunrsrergbruzw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<the anon/publishable key from Supabase>
```

Get the exact values from your Supabase project dashboard at
**supabase.com/dashboard/project/cggojpxunrsrergbruzw/settings/api** (URL and
"anon public" key). These are safe to expose in the browser — that's what
`NEXT_PUBLIC_` means — they only grant the access your Row Level Security
policies allow (public read of published content; writes require an
authenticated admin session).

You do **not** need a service-role/secret key for this app. Every admin
write goes through the logged-in admin's own session, governed by RLS — see
"How admin authentication works" below.

## 3. Connecting your domain

In Vercel: Project → **Settings → Domains** → add your domain → follow the
DNS instructions shown (usually a CNAME or A record at your domain
registrar). Vercel provisions HTTPS automatically. No application code
changes are needed.

## 4. How admin authentication works

- The admin dashboard lives at `/admin` (redirects to `/admin/login` if
  you're not signed in).
- Authentication is handled entirely by **Supabase Auth** — there's one
  admin account, created directly in Supabase.
- `src/proxy.ts` runs before every `/admin/*` request, checks for a valid
  Supabase session, and redirects to `/admin/login` if there isn't one.
- There is currently **one** admin account:
  - Email: `admin@novel-home.com`
  - Password: shared with you separately in chat when this was set up.
    **Change it immediately** — see below.

### Changing the admin password

The easiest way: sign in to `/admin`, go to **Settings**, and use the
"Admin Account" panel to set a new password — it takes effect immediately.

Alternatively, from the Supabase dashboard: **Authentication → Users →**
select the admin user **→ ⋯ → Reset Password** (or set a new one directly).

### Adding a second admin, or changing the admin email

Go to **Authentication → Users → Add User** in the Supabase dashboard and
create a new user with email + password confirmed. Every Row Level Security
policy in this project treats "any authenticated user" as an admin (this app
was built for a single small team, not public sign-ups — there is no public
registration page, so this is safe as long as you only create accounts for
people who should have admin access).

## 5. Where uploaded product images are stored

Product photos you upload from **Admin → Products → (a product) → Product
Images** go to a Supabase Storage bucket named `product-images`
(public-read, so the storefront can display them; only an authenticated
admin session can upload/delete). You can browse the files directly at
**Supabase Dashboard → Storage → product-images**.

Until you upload a real photo for a product, the storefront falls back to
the built-in placeholder art (a warm-toned graphic per category) — that's
intentional, not a bug, and is explained in the main `README.md`.

## 6. Backups

Supabase takes automatic daily backups on paid plans (Point-in-Time
Recovery on higher tiers). On the free tier, backups are not automatic —
you should periodically export your data:

- **Database**: Supabase Dashboard → Database → Backups (if on a paid
  plan), or run `pg_dump` against the connection string under
  **Project Settings → Database**.
- **Storage (product images)**: download the `product-images` bucket
  periodically from **Storage** in the dashboard, or script it with the
  Supabase CLI (`supabase storage ls` / `cp`).

If this store is real revenue-generating infrastructure, upgrading to a
paid Supabase plan for automatic backups is strongly recommended.

## 7. Using your own Supabase project instead

If you'd rather run this on a Supabase project you control (recommended
once this moves from prototype to production), you'll need to:

1. Create a new Supabase project.
2. Run the SQL migrations — ask your developer/AI assistant to re-apply
   the schema in `supabase/` equivalent (tables: `categories`, `products`,
   `product_variants`, `product_images`, `journal_posts`,
   `homepage_content`, `site_settings`, `contact_submissions`,
   `newsletter_subscribers`), the Row Level Security policies, and create
   the `product-images` storage bucket (public read, authenticated write).
3. Create your admin user under **Authentication → Users**.
4. Point `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` at the
   new project.
5. Re-seed your product/category/journal content (either manually through
   the admin dashboard, or by re-running a seed script against the new
   project).

## 8. Local development

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL + anon key
npm run dev
```

Visit `http://localhost:3000` for the storefront and
`http://localhost:3000/admin` for the dashboard.
