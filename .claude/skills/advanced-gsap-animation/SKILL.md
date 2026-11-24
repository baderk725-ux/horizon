---
name: advanced-gsap-animation
description: Portfolio-grade GSAP recipes and standards for React/Next.js — motion tokens, SplitText reveals, scrubbed and pinned ScrollTrigger sequences, Flip-based work-to-case-study transitions, quickTo cursors, batch reveals, responsive matchMedia variants and leak-free cleanup. Use when writing non-trivial GSAP choreography for a creative site; complements the official gsap-* API skills.
---

# Advanced GSAP Animation (portfolio recipes)

The official `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-react` and `gsap-performance` skills are the API source of truth. Load the relevant one when unsure of a signature. This skill adds **conventions and composed recipes** for premium portfolio work.

## Setup (once)

```ts
// lib/gsap.ts
"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase, useGSAP);
CustomEase.create("expo.out.soft", "0.16, 1, 0.3, 1");
CustomEase.create("cine.inOut", "0.65, 0, 0.35, 1");
gsap.defaults({ ease: "expo.out.soft", duration: 0.9 });
export { gsap, ScrollTrigger, SplitText, Flip, CustomEase, useGSAP };
```

GSAP and every plugin (SplitText, ScrollSmoother, MorphSVG, and the rest) are free for commercial use. Install with `npm i gsap @gsap/react`.

## Motion tokens

Derive these from the art-direction doc and never hard-code ad-hoc values in components:

```ts
export const dur = { micro: 0.2, ui: 0.45, reveal: 0.9, scene: 1.4 } as const;
export const stagger = { lines: 0.08, items: 0.06, chars: 0.02 } as const;
export const ease = { out: "expo.out.soft", inOut: "cine.inOut", linear: "none" } as const;
```

Rules: exits are about 30% faster than entrances. Scrubbed timelines use `ease: "none"` on tweens, because the scroll is the easing. Never use elastic or bounce on a premium/editorial concept unless the art direction says so.

## Component rules (React)

- Always `useGSAP(() => {...}, { scope: rootRef, dependencies: [...] })`. Selector strings are then scoped and everything is reverted on unmount.
- Event-handler animations use `contextSafe` from `useGSAP` so they're cleaned up too.
- Never create triggers in render. Never read layout inside `onUpdate`.
- Set initial hidden states inside the `useGSAP` callback (`gsap.set`) or via CSS gated by `prefers-reduced-motion: no-preference`. Never leave content hidden if JS fails.
- Wrap variants in `gsap.matchMedia()` so reduced-motion and breakpoint variants are reverted and rebuilt automatically.

## Recipes

### 1. Line-masked heading reveal (re-splits on resize and font load)

```tsx
useGSAP(() => {
  SplitText.create(headingRef.current!, {
    type: "lines", mask: "lines", autoSplit: true,
    onSplit: (self) => gsap.from(self.lines, {
      yPercent: 110, duration: dur.reveal, stagger: stagger.lines,
      scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
    }),
  });
}, { scope: rootRef });
```
Returning the tween from `onSplit` lets SplitText revert and recreate it on re-split.

### 2. Batch reveals for grids and lists (one trigger set, not N)

```ts
ScrollTrigger.batch("[data-reveal]", {
  start: "top 90%", once: true,
  onEnter: (els) => gsap.from(els, { autoAlpha: 0, y: 40, stagger: stagger.items, overwrite: true }),
});
```

### 3. Pinned, scrubbed case-study chapter

```ts
const tl = gsap.timeline({
  defaults: { ease: "none" },
  scrollTrigger: { trigger: section, start: "top top", end: () => "+=" + window.innerHeight * 3,
                   pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
});
tl.to(media, { scale: 1, clipPath: "inset(0% 0% 0% 0%)" })
  .to(caption, { autoAlpha: 1, y: 0 }, "<0.2")
  .addLabel("detail")
  .to(track, { xPercent: -66 }, "detail");
```
Use function-based `end` with `invalidateOnRefresh` so resizes recalculate. Add `snap: { snapTo: "labels", duration: 0.5 }` only if the chapters are discrete.

### 4. Horizontal gallery driven by vertical scroll

```ts
const distance = () => track.scrollWidth - window.innerWidth;
gsap.to(track, { x: () => -distance(), ease: "none",
  scrollTrigger: { trigger: wrap, pin: true, scrub: 1, end: () => "+=" + distance(), invalidateOnRefresh: true } });
```
Child animations inside it use `containerAnimation: thatTween`. Under reduced motion or on a narrow viewport, render a native `overflow-x: auto` scroller with scroll-snap instead.

### 5. Work grid → case-study hero (Flip shared element)

```ts
const state = Flip.getState(thumb);          // before: capture
heroSlot.appendChild(thumb);                 // change DOM / layout
Flip.from(state, { duration: dur.scene, ease: ease.inOut, absolute: true, zIndex: 10,
  onComplete: () => router.push(href) });
```
For cross-route morphs, prefer the native View Transitions API (`vercel-react-view-transitions`). Use Flip for same-page state changes, such as filtering or layout switching of the work index.

### 6. Cursor-follow and hover preview

```ts
const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
window.addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
```
Wrap it in `contextSafe`, remove the listener on cleanup, and gate it on `(pointer: fine)`.

### 7. Velocity-reactive skew and marquee

```ts
const skewTo = gsap.quickTo(target, "skewY", { duration: 0.5, ease: "power3" });
ScrollTrigger.create({ onUpdate: (self) => skewTo(gsap.utils.clamp(-6, 6, self.getVelocity() / -300)) });
```
Keep the effect subtle (≤ 6°) and disable it under reduced motion.

### 8. Number and counter tick for metrics

Animate a proxy object (`{ v: 0 }`) with `snap: { v: 1 }` and write `textContent` in `onUpdate`. Set `aria-live="off"` and render the final value in the HTML for SSR and SEO.

## Choreography standards

- Use the position parameter (`"<"`, `"<0.15"`, `"-=0.3"`, labels) rather than chained `delay`s.
- One focal motion at a time. Secondary elements trail the primary by 0.1–0.2s (`choreograph` skill).
- Stagger lists with `{ each, from: "start" }`. Cap the total stagger time at about 0.6s regardless of item count (`amount`).
- Scrub smoothing: 0.5–1 for a cinematic feel, `true` for precise UI.

## Debugging and quality

- `markers: true` only during development, behind an env flag. Never commit it on.
- After async content, image decode or font load: `ScrollTrigger.refresh()`. Use `ScrollTrigger.sort()` if triggers were created out of order.
- Leak check: navigate between routes 10× and confirm `ScrollTrigger.getAll().length` stays constant.
- Profile with `gsap-performance` and `animation-performance`. Run `review-animations` before sign-off.
