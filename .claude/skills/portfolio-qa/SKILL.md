---
name: portfolio-qa
description: Browser-based QA for portfolio and creative sites — automated multi-viewport screenshots, overflow, console/network errors, accessibility and SEO structure, LCP/CLS, reduced-motion pass, plus a manual review checklist for motion, 3D, keyboard and cross-browser behaviour. Use before declaring any page or feature done, after visual/motion changes, or when asked to test, QA, audit responsiveness or check a creative site in the browser.
---

# Portfolio QA

Never claim a creative page works or looks right without seeing it render. This skill gives you an automated sweep (`scripts/qa.cjs`) plus the manual checks that automation can't make. For deeper work: `playwright-cli` (interactive browser driving and test authoring), `accessibility`, `core-web-vitals`, `web-quality-audit`, `review-animations` and `web-design-guidelines`.

## 1. Automated sweep

Serve the site first: `npm run dev`, `npm run build && npm start`, or `npx http-server . -p 4173 -s` for static files. Then run:

```bash
node .claude/skills/portfolio-qa/scripts/qa.cjs http://localhost:3000 --out qa-report
# options: --widths 360,768,1024,1440,1920   --axe   (axe needs: npm i -D axe-core)
# run once per key route: /, /work, /work/<slug>, /about, /contact, /404
```

What it does per viewport: takes a full-page screenshot after scrolling through (so lazy and scroll-triggered content renders), and records console and page errors, failed requests, horizontal overflow with the offending elements, `lang`/title/meta/canonical/OG/JSON-LD presence, `h1` count, `<main>`, images without alt, unnamed links and buttons, small touch targets, LCP and CLS. It then runs one extra pass with `prefers-reduced-motion: reduce`. The exit code is 1 if there are blocking issues.

Requires Playwright (`require("playwright")`). In this cloud environment it is preinstalled. Elsewhere, run `npm i -D playwright && npx playwright install chromium`.

**Then look at the screenshots** (Read tool on `qa-report/*.png`). Check them against `docs/art-direction.md`: hierarchy, spacing rhythm, type scale at every width, image crops, nothing clipped or overlapping, and that the reduced-motion screenshot shows all content (nothing stuck at `opacity: 0`).

Lab LCP from a local dev server is indicative only. Use a production build for numbers, and field data (CrUX/Vercel Speed Insights) once live.

## 2. Manual and interactive checks (use `playwright-cli` to drive)

**Keyboard and focus**
- [ ] Tab through every page: the order follows the visual order, focus is always visible, and there are no traps (menus and modals trap *intentionally* and release on Esc).
- [ ] A skip link to `main` exists. After route transitions, focus moves to the new page's heading or main.

**Motion**
- [ ] Scroll the full page slowly and quickly, and reverse. Pinned sections release correctly and nothing jumps at pin start or end.
- [ ] Resize mid-page: triggers recalculate (no misaligned pins or reveals).
- [ ] Navigate between routes 10×: no duplicated animations, the scroll position resets, and there are no console warnings. `ScrollTrigger.getAll().length` is stable.
- [ ] Reduced motion: no smooth scroll, no parallax or pins, and content is fully readable.
- [ ] Performance trace while scrolling: about 60fps, no long tasks > 50ms (`animation-performance`).

**3D (if present)**
- [ ] The poster or fallback renders when WebGL is unavailable (launch with `--disable-webgl`) and under reduced motion.
- [ ] Draw calls and memory are recorded. There is no WebGL context loss after navigations. The canvas pauses offscreen.

**Content and SEO**
- [ ] No lorem ipsum or placeholder links. Every external link works and opens deliberately.
- [ ] Titles and descriptions are unique per route. OG image renders (open `/opengraph-image` directly). JSON-LD validates (`schema` skill).
- [ ] `sitemap.xml` and `robots.txt` are served, and a 404 page exists in the site's voice.

**Forms and conversion**
- [ ] The contact form validates inline, submits, shows its success state, and the mailto fallback works.
- [ ] The primary CTA is reachable from every page.

**Cross-browser and device**
- [ ] Chromium, WebKit and Firefox via Playwright (`playwright-cli` can launch each). Pay attention to Safari: `backdrop-filter`, `position: sticky` inside overflow containers, video autoplay, and `100vh` (use `dvh`/`svh`).
- [ ] Touch emulation: hover-only affordances have touch equivalents, and the custom cursor is disabled.

## 3. Reporting format

```
QA — <route> — <date>
Blocking: (must fix) …
Warnings: …
Visual review: (what you saw in screenshots, per width)
Motion/3D: …
Verdict: PASS / FAIL (with remaining items)
```

Fix the blocking items, re-run the sweep, and include the before/after evidence. Never report PASS from code reading alone.
