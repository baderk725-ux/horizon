---
name: tailwind-v4-design-tokens
description: Tailwind CSS v4 setup and design-token architecture for Next.js creative sites — CSS-first @theme tokens (OKLCH colour, fluid type, spacing, easing), next/font integration, dark/theme variants, custom utilities, container queries and motion-safe variants. Use when setting up Tailwind v4, translating an art-direction doc into tokens, theming, or fixing Tailwind v4 config issues.
---

# Tailwind CSS v4 Design Tokens (Next.js)

Tailwind v4 is configured **in CSS**. There is no `tailwind.config.js` by default. Tokens declared in `@theme` become both CSS variables and utilities.

## Install (Next.js)

```bash
npm i tailwindcss @tailwindcss/postcss postcss
```

```js
// postcss.config.mjs
export default { plugins: { "@tailwindcss/postcss": {} } };
```

```css
/* app/globals.css */
@import "tailwindcss";
```

Upgrading from v3: run `npx @tailwindcss/upgrade` on a clean git tree and review the diff. For a Vite project, use `@tailwindcss/vite` instead of PostCSS.

## Token architecture

Translate `docs/art-direction.md` into tokens. Components reference **semantic** tokens only.

```css
@import "tailwindcss";

/* 1. Fonts from next/font (variables set on <html>) — inline so utilities reference the var */
@theme inline {
  --font-display: var(--font-display-face), ui-serif, serif;
  --font-sans: var(--font-text-face), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-mono-face), ui-monospace, monospace;
}

@theme {
  /* 2. Palette (raw) — OKLCH */
  --color-ink-950: oklch(0.14 0.005 260);
  --color-ink-50:  oklch(0.97 0.004 90);
  --color-signal:  oklch(0.72 0.19 45);

  /* 3. Fluid type scale (360px → 1600px) */
  --text-body: clamp(1rem, 0.95rem + 0.25vw, 1.25rem);
  --text-body--line-height: 1.55;
  --text-display: clamp(3.5rem, 1rem + 11vw, 14rem);
  --text-display--line-height: 0.9;
  --text-display--letter-spacing: -0.04em;

  /* 4. Space, layout, breakpoints */
  --spacing: 0.25rem;                 /* base unit: p-4 = 1rem */
  --breakpoint-3xl: 120rem;
  --container-prose: 68ch;

  /* 5. Motion tokens (match lib/motion-tokens.ts) */
  --ease-out-soft: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-cine: cubic-bezier(0.65, 0, 0.35, 1);
  --duration-ui: 450ms;               /* use as duration-(--duration-ui) */
}

/* 6. Semantic layer — swap per theme */
:root {
  --bg: var(--color-ink-950);
  --fg: var(--color-ink-50);
  --accent: var(--color-signal);
}
[data-theme="light"] { --bg: var(--color-ink-50); --fg: var(--color-ink-950); }

@theme inline {
  --color-bg: var(--bg);
  --color-fg: var(--fg);
  --color-accent: var(--accent);
}
```

- Use `@theme inline` whenever a token's value is another variable, so utilities emit `var(--bg)` rather than a value frozen at build time.
- To wipe a default namespace (for example, the entire default colour palette): `--color-*: initial;` inside `@theme`, then define your own.
- Per-project accent: set `style={{ "--accent": project.accent }}` on the case-study root. Every `text-accent`/`bg-accent` utility then follows it.

## Variants for themes and capabilities

```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
@custom-variant pointer-fine (@media (hover: hover) and (pointer: fine));
```

Built-ins to use: `motion-safe:` / `motion-reduce:`, `starting:` (for `@starting-style` entry transitions), `not-*`, `has-*`, `group-*`/`peer-*`, `supports-*`, `@container` + `@sm:`/`@lg:` container queries, `inert:`, `open:`, `aria-*:` and `data-*:`.

## Custom utilities and base styles

```css
@utility container-site { margin-inline: auto; padding-inline: clamp(1.25rem, 4vw, 4rem); max-width: 120rem; }
@utility text-balance-safe { text-wrap: balance; }
@utility mask-reveal { overflow: clip; }

@layer base {
  html { background: var(--bg); color: var(--fg); -webkit-font-smoothing: antialiased; }
  ::selection { background: var(--accent); color: var(--bg); }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
}
```

- Content from packages: `@source "../node_modules/<pkg>";`. Plugins: `@plugin "@tailwindcss/typography";`.
- Arbitrary values referencing tokens: `w-(--container-prose)`, `ease-(--ease-cine)`.

## next/font wiring

```tsx
import localFont from "next/font/local";
import { Inter } from "next/font/google";
const display = localFont({ src: "../public/fonts/Display-Variable.woff2", variable: "--font-display-face", display: "swap" });
const text = Inter({ subsets: ["latin"], variable: "--font-text-face", display: "swap" });
// <html className={`${display.variable} ${text.variable}`} data-theme="dark">
```

## Rules

- No raw hex values or one-off arbitrary values in components. If a value is needed twice, it becomes a token.
- Pair colours are verified for AA contrast in both themes.
- Class lists > ~12 utilities or repeated 3+ times → extract a component, not an `@apply` soup. Use `@apply` sparingly, inside `@utility` or third-party overrides only.
- Prevent the theme flash: set `data-theme` before paint with a tiny inline script in `<head>` reading `localStorage` and `prefers-color-scheme`.
- Use `cn()` (clsx + tailwind-merge) for conditional classes in components.
