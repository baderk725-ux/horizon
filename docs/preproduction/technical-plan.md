# Technical Plan — 3D Assets, Architecture, Mobile, Performance & Accessibility

**Status:** proposal v1 · Versions verified working together in this environment on 2026-11-24 (see [skills audit](../skills-audit-final.md)).

## 1. The Digital Flow — implementation decision

| Option | Verdict |
|---|---|
| Plain three.js | Works, but you hand-wire lifecycle, resize and React integration. |
| **React Three Fiber + custom shaders** | ✅ **Chosen.** R3F for scene lifecycle, Suspense, DOM-synced events and Next.js integration; **a custom `ShaderMaterial` on `THREE.Points`** for the Flow itself; drei for helpers. |
| GPGPU / FBO particle simulation | ❌ Not needed, and it would *hurt*: simulations are path-dependent, so scrolling backwards wouldn't replay the same frames. Our Flow is a **deterministic function of scroll + time**, which makes it fully reversible. |

**How it works (proven in the concept-frame prototype):**
- One `Points` mesh. Per-particle attributes: `aIndex`, `aSeed`, `aT` (position along the curve), `aOffset` (u,v across the ribbon width), `aSize`, `aCore` (luminous spine particles).
- **Formations** (ribbon, loop, 4 panels + glyphs, gallery light, orbits, portal) are precomputed point sets stored as `DataTexture`s. The vertex shader samples formation A and formation B by `aIndex` and mixes them with `uMorph` plus a per-particle delay (`clamp((m - seed*0.4)/0.6)`) for organic staggering.
- Ribbon motion: `t = fract(aT + uTime * speed)` along a curve, also baked to a texture, with curl-noise displacement for life.
- Fragment: a soft disc, additive blending, depth fade. Bloom picks up only the dense core.
- Scroll → `uChapter`/`uMorph` via the shared store; pointer → `uPointer` (damped).

**Lessons already learned in the prototype (applied to production):**
1. **Colour management:** set `scene.background` rather than `renderer.setClearColor`. With a float postprocessing target, the clear colour was gamma-encoded twice and lifted obsidian to grey.
2. **Selective bloom:** the bloom threshold must sit above silver type luminance (≈ 0.80 linear); otherwise the wordmark halos the whole frame.
3. **Canvas text:** `ctx.font` rejects percentage `font-stretch`; use the `fontStretch` property.
4. **Depth:** glyph particles must sit at least 0.05 units off panel planes, or they z-fight and vanish.

## 2. 3D asset & modelling requirements

**No external 3D models are required.** Every 3D element is procedural, which keeps the payload tiny and the look fully ownable.

| Asset | Source | Format / budget |
|---|---|---|
| Flow formations | Generated at build time by a script (curves, SVG glyph outlines sampled to points) | `Float32` binaries, ≤ 600 KB total, lazy per chapter |
| Interface glyphs (Scene 03) | 4 hand-drawn SVGs (grid, code, cube, chat) sampled to points | SVG source in the repo |
| 3D wordmark | Rendered with troika-three-text (via drei `<Text>`) using **self-hosted Archivo** | Font file ≈ 90 KB (woff) |
| Project media | **Real captures of the 4 concept builds** (stills + 6s loops) | AVIF/WebP stills ≤ 180 KB; H.264/VP9 loops ≤ 1.5 MB each; KTX2 for WebGL textures |
| Reduced-motion posters | Rendered from the production scene per chapter (same pipeline as the concept frames) | AVIF, 1 per chapter per breakpoint |
| OG images | `next/og` with brand fonts | Generated |
| Environment maps / HDR | **Not needed** (no metallic materials) | — |

**Budget (landing route, desktop high tier):** ≤ 60 draw calls · 30k particles · 3D JS ≤ 250 KB gzip (lazy) · total 3D payload ≤ 2 MB.

## 3. Technical architecture

**Stack (verified compatible):** Next.js 16.4 (App Router, static) · React 19.3 · TypeScript 7.0 (strict) · Tailwind CSS 4.3 · GSAP 3.15 + @gsap/react (ScrollTrigger, SplitText, ScrambleText, Flip, CustomEase) · Lenis 1.3 · Motion 14 (component/UI state) · three r187 + R3F 9.8 + drei 10.7 + @react-three/postprocessing · Lucide 1.78 · Zod 4 (content validation) · @anthropic-ai/sdk (ORBIT, server-side only) · Playwright 1.63 (pinned to the installed Chromium) · Vercel (deploy, after approval).

**One Next.js app, four concept apps inside it:**

```
app/
  (site)/                  portfolio: layout with Lenis, cursor, HUD, persistent <FlowCanvas>
    page.tsx               home: six chapters
    work/[slug]/page.tsx   case studies (generateStaticParams, MDX)
    about/  contact/
  (concepts)/              each concept has its OWN layout + design tokens + "Independent concept" banner
    aurex/                 creative studio site (GSAP + 3D)
    nova/                  SaaS dashboard (charts, components, responsive)
    orbit/                 AI assistant UI
    vanta/                 luxury e-commerce (collections, PDP, cart)
  api/orbit/chat/route.ts  streaming Claude route (server-only key; demo mode without key)
  sitemap.ts  robots.ts  opengraph-image.tsx  not-found.tsx
content/work/*.mdx         case-study content, zod-validated frontmatter
lib/                       gsap.ts, lenis.ts, store.ts (scroll/chapter), seo.ts, motion-tokens.ts
```

- **Why one app:** a single deploy and domain, shared tooling, and each concept is a live, clickable proof. Separate layouts keep the concept identities isolated from the portfolio's.
- **Rendering:** everything is static except `api/orbit/chat` (Node runtime, streaming).
- **ORBIT safety:** the key lives in a server env var and is never sent to the client. Inputs go through a zod schema and are length-capped. Rate limiting is per IP. Without a key, a **clearly labelled demo mode** plays scripted responses.
- **VANTA:** fictional products in typed local data (labelled "concept — not for sale"). The cart uses React context + `localStorage`. There is no checkout or payment, and the UI says so.
- **NOVA:** deterministic generated demo data (labelled). Charts are custom SVG with d3-scale/d3-shape (small, fully stylable and animatable), not a heavy chart library.

## 4. Component architecture

```
components/
  ui/            Button (magnetic variant) · Link · Text · Tag · Media (aspect-locked, clip reveal) · VisuallyHidden
  layout/        SiteHeader · ChapterHUD · Footer · ConceptBanner
  motion/        SmoothScroll (Lenis↔GSAP) · SplitReveal · WidthFlow (variable wdth on scroll) · Scramble
                 Magnetic · Cursor · PageTransition · ReducedMotionGate
  three/
    FlowCanvas.tsx       single persistent <Canvas> (client, dynamic import, ssr:false)
    Flow/                FlowPoints.tsx · flow.vert/frag.glsl · formations.ts (loader) · useFlowUniforms.ts
    Wordmark3D.tsx       troika text + DOM crossfade
    WorkGallery3D.tsx    card planes + dissolve shader
    SystemOrbits.tsx     core, orbits, nodes (+ DOM mirror)
    Portal.tsx
    quality.ts           tier detection + PerformanceMonitor policy
  sections/      Signal · Form · Interface · Work · System · Beyond   (DOM content = source of truth)
  concepts/      aurex/* · nova/* · orbit/* · vanta/*   (isolated; no imports from (site))
```

**Rules:** sections render all content as server components. Motion and 3D are client leaves that *enhance* existing DOM. Shared scroll state lives in a tiny store of refs (`lib/store.ts`), with no per-frame React re-renders. GSAP plugins are registered once in `lib/gsap.ts`.

## 5. Mobile experience strategy

| Aspect | Desktop | Mobile (≤ 768px / coarse pointer) |
|---|---|---|
| Scroll | Lenis | **Native** (better momentum, no jank) |
| Flow particles | 30k + bloom | **8k, no postprocessing**, DPR 1–1.5 |
| Scene 03 | Pinned arc of 4 panels | No pin; 2×2 panels then a list (frame m03) |
| Scene 04 | WebGL depth gallery | Native scroll-snap carousel of DOM images |
| Scene 05 | 3D orbits + hidden DOM list | DOM chip list with filter as the primary UI; light 3D core only |
| Scene 06 | Wide portal | Vertical oval portal (frame m06) + radial scrim |
| Cursor / magnetic | Yes | No (tap states instead) |
| Type | Display XL up to 15rem | Scales via clamp; the wordmark fits 360px |

**Low-power tier** (≤ 4 cores, Save-Data, or FPS < 45 for 2s): 4k particles, no bloom, half resolution. **Static tier** (reduced motion or no WebGL2): pre-rendered posters.

## 6. Performance strategy

- **LCP is HTML:** the SSR `h1` + statement. The canvas never blocks first paint. Fonts are preloaded (2 files) with `display: swap`.
- **Budgets:** mobile LCP < 2.5s · CLS < 0.1 · INP < 200ms · landing JS < 200 KB gzip excluding the lazily loaded 3D chunk.
- **Lazy everything:** the 3D chunk loads after first paint (idle). Formations load per chapter. Videos only play on hover or when in view, with posters.
- **The frame loop** pauses when the tab is hidden or the canvas is offscreen. There is one ticker (GSAP) for Lenis, ScrollTrigger and R3F (`frameloop="never"` + manual advance).
- **Measured, not assumed:** `portfolio-qa` sweeps every route, plus Performance traces of each chapter (60fps target desktop, 30+ fps mobile tier). Numbers are recorded in the PR.

## 7. Accessibility strategy

- **DOM is the source of truth:** every word, link and button exists in semantic HTML. The canvas is `aria-hidden` (decorative). Chapters are `<section>`s with headings; there is one `h1` per page.
- **Keyboard:** a skip link, visible lime focus rings (15 : 1), and panels, cards and the filter are all focusable with Enter/Space parity. The project dialog traps focus and Esc closes it.
- **Reduced motion:** the full alternative experience above, plus an in-page **motion toggle** in the footer for users who don't set the OS preference.
- **Contrast:** all text pairs are AA or better (verified: silver 16.4, lime 15.0, muted 6.4 : 1).
- **Honesty labels:** "Independent concept — not a client project" is visible on every concept card, case study and concept app.
- **Testing:** axe-core in `portfolio-qa`, keyboard walkthroughs via `playwright-cli`, and screen-reader spot checks of the home and case-study templates.

## 8. Build phases after approval

| Phase | Deliverable | Gate |
|---|---|---|
| 3 System | Tokens, type, grid, UI primitives | Visual check of a token page |
| 4 Static | All home sections + case-study template, zero motion, fully responsive and accessible | `portfolio-qa` green |
| 5 Motion | Lenis, reveals, width flow, cursor, magnetic, transitions | `review-animations` + traces |
| 6 3D | FlowCanvas, formations, the four signature moments, tiers, posters | FPS + memory budgets |
| 5b/Concepts | AUREX · NOVA · ORBIT · VANTA builds | Functional tests per concept |
| 7 SEO/Perf | Metadata, JSON-LD (Person, ProfilePage, CreativeWork), OG, sitemap | Lighthouse/CWV budgets |
| 8 QA | Cross-browser, mobile, accessibility, final polish | Full QA report |
| Deploy | Vercel preview only → **production only with your approval** | — |

The hero (Scene 01) gets built to full polish first and shown to you before the rest is replicated.
