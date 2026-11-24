---
name: cinematic-web-development
description: Engineering cinematic, immersive portfolio experiences in Next.js/React — Lenis smooth scroll wired to GSAP, preloaders, page transitions, scroll-driven storytelling, custom cursors, magnetic UI, experimental navigation and reduced-motion fallbacks. Use when implementing the motion/experience layer of a creative or award-style site, or when the user asks for cinematic, immersive, storytelling, smooth-scroll, page transitions or custom cursor effects.
---

# Cinematic Web Development

Use this skill to architect the experience layer. For APIs, use the specialists: `gsap-*` (official GSAP), `motion`, `vercel-react-view-transitions`, and `cinematic-gsap-lenis-motion-system` (a deep reference system for Lenis+GSAP). For scroll stories, see `horizontal-scroll-scenes` and `editorial-portfolio-chapters`. For timing and feel, see `emil-design-eng` and `choreograph`.

## Non-negotiables

1. **Content first, motion second.** The page is complete, accessible and readable with JS disabled or with `prefers-reduced-motion: reduce`.
2. **One clock.** Lenis, ScrollTrigger and any WebGL render loop are driven by the same `gsap.ticker`. Never run competing rAF loops.
3. **Transforms and opacity only** for anything running per-frame. Never animate `top/left/width/height/filter: blur()` on large areas while scrolling.
4. **Everything cleans up.** Route changes must kill triggers, timelines, observers and listeners (`useGSAP` + `gsap.context` handle most of it).
5. **Never hijack the user.** No scroll-jacking that breaks wheel, trackpad, keyboard (Space/PageDown/Home/End), anchors, find-in-page or back/forward position.

## Architecture (Next.js App Router)

```
app/layout.tsx            <SmoothScroll> <Cursor/> <PageTransition>{children}</PageTransition> </SmoothScroll>
components/motion/
  SmoothScroll.tsx        Lenis root + GSAP ticker bridge (client)
  PageTransition.tsx      route transition orchestration (client)
  Reveal.tsx, SplitHeading.tsx, Parallax.tsx, Magnetic.tsx, Cursor.tsx
lib/gsap.ts               "use client"; registers plugins once, exports gsap + plugins
lib/motion-tokens.ts      easings + durations from the art-direction doc
```

### Lenis ↔ GSAP bridge

```tsx
"use client";
import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    const lenis = lenisRef.current?.lenis;
    lenis?.on("scroll", ScrollTrigger.update);
    return () => { gsap.ticker.remove(update); lenis?.off("scroll", ScrollTrigger.update); };
  }, []);
  return <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1 }}>{children}</ReactLenis>;
}
```

- Import `lenis/dist/lenis.css`.
- Under reduced motion, don't mount Lenis (native scroll) and set `ScrollTrigger` scrubs to jump.
- Disable smooth scrolling on touch devices unless the concept requires it. Native touch momentum is better.
- Nested scroll areas (modals, horizontal galleries) need `data-lenis-prevent`.
- On route change: `lenis.scrollTo(0, { immediate: true })`, then `ScrollTrigger.refresh()` once new content and fonts have settled (`document.fonts.ready`).

## Building blocks and their rules

**Preloader / intro**
- Only if it masks real loading (fonts, hero media, 3D) or is a signature moment. Cap it at about 2.5s, show it only on the first visit per session (`sessionStorage`), and keep it skippable.
- Never block LCP: the hero's real content is in the HTML underneath. The loader is an overlay that animates away.

**Text reveals**: use GSAP `SplitText` with `mask: "lines"`, `autoSplit: true` and an `onSplit()` that returns the animation, so it re-splits on resize and font load. Keep `aria` handling on (the default), so screen readers read the original text. Reveal per line, not per character, for body-adjacent text. Per-character reveals are for short display words only.

**Media reveals**: animate `clip-path: inset()` or a scaled inner wrapper inside an `overflow: hidden` frame. Reserve aspect-ratio boxes so nothing shifts (CLS).

**Parallax**: small `yPercent` deltas (5–20%) on inner layers, `scrub: true`, and transforms only. No parallax on text the user is reading.

**Pinned storytelling**: `ScrollTrigger` `pin: true` plus a scrubbed timeline. Size the pin length to the content (`end: "+=" + n*100 + "%"`). Provide a non-pinned stacked layout under reduced motion and on short viewports. Horizontal sections: see `horizontal-scroll-scenes`.

**Page transitions**
- Preferred: the **View Transitions API** (`vercel-react-view-transitions` skill; Next.js `experimental.viewTransition`) for shared-element morphs such as a work thumbnail into a case-study hero. It has progressive enhancement built in.
- Alternative: an overlay curtain driven by GSAP, triggered via a custom `TransitionLink` that plays "out", calls `router.push`, then plays "in" on the new route's mount.
- Transitions stay under 900ms total and are never on the critical path for back/forward. Respect reduced motion with a crossfade or no transition.
- Manage focus after navigation (move focus to the new `h1` or main) and announce the route change.

**Custom cursor**
- Only on `(hover: hover) and (pointer: fine)`. Never on touch.
- Keep the native cursor *visible* unless the custom cursor is always present and high-contrast. Never hide it on form fields or text.
- Implement with `gsap.quickTo(el, "x", {duration: 0.4, ease: "power3"})` for x and y. One element with `pointer-events: none`, `position: fixed`, `will-change: transform`.
- States (hover a project → "View", drag zones → "Drag") are driven by `data-cursor="..."` attributes via event delegation, not per-element listeners.

**Magnetic UI**: translate toward the pointer by 20–35% of the offset within the element bounds and spring back on leave (`quickTo` or Motion springs). Keep the clickable area static; move only an inner span.

**Experimental navigation** (fullscreen menus, index-as-nav, keyboard-driven, draggable canvases)
- It must stay a real `<nav>` with `<a href>` links in DOM order and work with Tab, Enter and Esc. A fullscreen menu traps focus while open and restores it on close.
- Provide one conventional affordance (a visible "Menu"/"Work"/"Contact") so first-time visitors aren't lost.
- WebGL or canvas navigation must have an equivalent DOM list.

**Hover previews in work indexes**: a floating media element following the cursor (`quickTo`), revealed with a clip-path, loading `loading="lazy"` assets on pointerenter intent. On touch, fall back to inline thumbnails.

## Reduced-motion and capability strategy

```ts
gsap.matchMedia().add(
  { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)", desktop: "(min-width: 1024px)" },
  (ctx) => { const { motion, desktop } = ctx.conditions!; /* build variants */ }
);
```

- Reduce = no smooth scroll, no parallax, no pins, opacity-only reveals ≤ 200ms, instant page changes or crossfades, and a static 3D poster.
- Low-power devices (`navigator.hardwareConcurrency <= 4`, Save-Data, or a failed FPS probe) get the reduced 3D tier (see `interactive-3d-portfolio`).

## Performance checklist for cinematic pages

- [ ] Hero LCP element is real HTML or an `<img>`/`next/image` with `priority`, never a canvas or animated-in text that starts at `opacity: 0` without SSR content.
- [ ] Animations that start hidden set their initial state in CSS gated on a `.js` class or `@media (prefers-reduced-motion: no-preference)`, so content never stays invisible if JS fails.
- [ ] `ScrollTrigger.refresh()` runs after fonts and images load. There are no layout reads inside scroll callbacks.
- [ ] Heavy modules (three, postprocessing, SplitText-heavy sections) are behind `next/dynamic` or a dynamic `import()`.
- [ ] Measured: 60fps scroll in a Performance trace. Main-thread tasks < 50ms during scroll. Use `animation-performance` and `gsap-performance`.

## Done means

The experience passes `review-animations`, behaves with keyboard only, degrades under reduced motion, has no layout shift, and has been watched in a real browser via `portfolio-qa` at desktop and mobile sizes.
