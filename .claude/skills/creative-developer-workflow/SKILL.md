---
name: creative-developer-workflow
description: End-to-end workflow, stack defaults, TypeScript standards and skill routing for building premium portfolio and creative websites in this repo. Use at the start of any portfolio/creative-site task, when choosing the stack or project structure, when unsure which installed skill applies, or before declaring a creative build done.
---

# Creative Developer Workflow

The operating system for building award-calibre portfolio sites here. It sets the order of work, the default stack and the quality gates, and it tells you which specialist skill to load at each step. Load the specialist skills; don't re-derive what they already cover.

## Phase order (do not skip ahead)

| # | Phase | Output | Load these skills |
|---|-------|--------|-------------------|
| 0 | **Brief & brand** | `.agents/product-marketing.md` (brand context), audience, one-line positioning, primary CTA | `personal-brand-website` |
| 1 | **Art direction** | Direction doc: concept, references, type, colour, grid, motion and 3D principles | `portfolio-art-direction`, `frontend-design`, `no-ai-design-slop` |
| 2 | **Architecture & content** | Sitemap, page outlines, case-study drafts, real copy (no lorem) | `site-architecture`, `portfolio-case-study`, `copywriting` |
| 3 | **System** | Tokens, type scale, grid, components | `tailwind-v4-design-tokens`, `composition-patterns` |
| 4 | **Static build** | Every page complete, responsive and accessible with **zero** motion | `nextjs`, `react-best-practices`, `accessibility` |
| 5 | **Motion layer** | Smooth scroll, reveals, transitions, cursor | `cinematic-web-development`, `advanced-gsap-animation`, `motion`, `react-view-transitions`, `emil-design-eng` |
| 6 | **3D layer** (only if the concept earns it) | Hero/world scene with fallbacks | `interactive-3d-portfolio`, `threejs-*` |
| 7 | **SEO & performance** | Metadata, JSON-LD, sitemap, CWV budget met | `seo`, `schema`, `core-web-vitals`, `performance`, `next-bundle-optimizer` |
| 8 | **QA & polish** | QA report, fixes, final review | `portfolio-qa`, `playwright-cli`, `review-animations`, `web-design-guidelines`, `web-quality-audit`, `copy-editing` |

Phase 4 before 5 is a rule: the site must read and work fully with JavaScript animation off. Motion is an enhancement layer.

## Default stack (change only with a reason)

- **Next.js (App Router) + React + TypeScript (strict)**. Use static rendering for everything that can be static; a portfolio is almost entirely static.
- **Tailwind CSS v4** with CSS-first `@theme` tokens (see `tailwind-v4-design-tokens`).
- **GSAP 3 (+ScrollTrigger, SplitText, Flip, CustomEase)** for timeline and scroll choreography. All GSAP plugins are free, including the former Club plugins.
- **Lenis** for smooth scroll, driven by GSAP's ticker.
- **Motion** (`motion/react`) for component-level state, layout and gesture animation. Don't let GSAP and Motion animate the same property on the same element.
- **React Three Fiber + drei** for 3D; plain three.js for one-off canvases outside React.
- **MDX or typed TS content files** for case studies. Add a CMS only if the user needs one.
- Deploy target: Vercel (the official Vercel plugins/skills cover deployment).

For a single-page experimental piece with no routing needs, Vite + TS is acceptable. Say why.

## Project structure

```
app/                     routes, layout.tsx, metadata, sitemap.ts, robots.ts, opengraph-image.tsx
  (site)/work/[slug]/    case studies (generateStaticParams)
components/
  ui/                    primitives (Button, Link, Media, Text)
  sections/              page sections (Hero, WorkIndex, About, Contact)
  motion/                SmoothScroll, Reveal, SplitHeading, PageTransition, Cursor
  three/                 Canvas wrappers, scenes, materials, shaders/
content/work/*.mdx       case-study content + frontmatter
lib/                     gsap.ts (plugin registration), lenis.ts, seo.ts (JSON-LD builders), utils
styles/globals.css       Tailwind import + @theme tokens
public/                  optimized media, fonts, models (*.glb, Draco/KTX2)
```

Register GSAP plugins **once** in `lib/gsap.ts` (`"use client"` module) and import from there.

## TypeScript standards

- `strict: true`, `noUncheckedIndexedAccess: true`. No `any`. Use `unknown` and narrow.
- Type content with schemas, for example a `CaseStudy` type or a zod schema validated at build time, so a missing field fails the build, not production.
- Keep Server Components as the default. Add `"use client"` only to leaf components that need effects, refs or browser APIs. Animation wrappers are client leaves that accept server-rendered children.
- Props: explicit interfaces, no default-exported anonymous components, and `as const` for token maps.
- Refs for animation targets: `useRef<HTMLDivElement>(null)`. Never query the global DOM from a component; scope selectors (`useGSAP({ scope })`).

## Quality gates (all must pass before "done")

1. **Content**: real copy, real or clearly-marked placeholder media, no lorem, no fabricated clients or metrics.
2. **Responsive**: no horizontal overflow at 360, 768, 1024, 1440 and 1920px. Touch targets ≥ 44px.
3. **Accessible**: keyboard-complete with visible focus, landmarks, one `h1` per page, alt text, colour contrast AA, `prefers-reduced-motion` respected (the motion layer degrades to opacity fades or none).
4. **Performance**: mobile LCP < 2.5s, CLS < 0.1, INP < 200ms. JS on the landing route is budgeted (aim < 200KB gzip excluding three.js chunks, which must lazy-load).
5. **SEO**: unique titles and descriptions, OG images, canonical, sitemap, robots, Person/ProfilePage JSON-LD.
6. **Motion craft**: passes `review-animations`, has no scroll-jank (60fps on a mid-range laptop), and no animation blocks reading or input.
7. **Verified in a real browser**: run `portfolio-qa` and look at the screenshots yourself. Never claim visual quality from code alone.

## Working rules

- Show the art-direction doc to the user before building. Taste decisions are theirs.
- Build one section to full polish first (usually the hero), get sign-off, then replicate the standard.
- Commit per phase. Keep motion and 3D in separate commits from layout so they can be bisected.
- When a skill's guidance conflicts with this workflow, this workflow wins on process and the specialist wins on API details.
