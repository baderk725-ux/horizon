# Hero Review — Phase 4 (awaiting Khaled's approval)

**Build:** `portfolio/` · Next.js 16.4 · production build · reviewed 2026-11-24
**Recordings:** `hero-desktop.mp4` (1440×900, high tier) and `hero-mobile.mp4` (390×844, low tier). They're sent separately and not committed to git.

> ⚠️ The recordings were made in a cloud container **without a GPU** (software WebGL), so playback is choppier than on any real device. Timing is real; smoothness isn't representative. Please also run it locally (see below).

![Desktop sequence](desktop-sequence.jpg)
![Mobile sequence](mobile-sequence.jpg)

## What to review

1. **The opening** (first visit): veil + counter → the scattered signal gathers into the Flow → KHALED rises letter by letter from its masks, *inside* the 3D space (the Flow passes behind K-H-A-L and in front of the D) → the offer and CTAs → the nav.
2. **Business positioning:** the first viewport says what you sell and to whom, with **Start a project** as the primary action.
3. **Interaction (desktop):** move the cursor across the Flow; particles part around it and the camera follows with a gentle parallax.
4. **Scroll-out:** the wordmark lifts and drifts toward the camera while the Flow carries on into Scene 02.
5. **Repeat visits:** no veil and no letter rise; the wordmark is already in place and only the particles gather.
6. **Mobile:** the same story, re-staged vertically. 9k particles with no bloom (a brighter core instead), native scroll, and a legibility scrim behind the offer.
7. **Reduced motion:** a still render of the Flow, everything visible immediately, no veil and no smooth scroll.

## Verified

| Check | Result |
|---|---|
| Production build, TypeScript 7 strict | ✅ |
| QA sweep: 7 routes × 6 widths (360–1920) + reduced motion, axe-core | ✅ 0 blocking |
| Lab LCP (local, no throttling) | 88–196 ms on every route; the first-visit intro does not delay LCP |
| Keyboard | Skip link → logo → nav → CTAs, visible lime focus rings |
| Inquiry form + API | Validation, honeypot, webhook delivery, mailto fallback, "unconfigured" state, all tested |
| Console errors | None from our code (R3F 9.8 logs a known `THREE.Clock` deprecation notice) |

## Decisions you may want to weigh in on

- **Mobile intro:** the offer line is visible from the first frame, because it's the LCP element on phones and hiding it would cost up to ~2s of LCP on slow devices. On desktop it reveals after the wordmark, as storyboarded.
- **Preloader:** shown once per session, capped at 2.0s, and it only covers real work (fonts + shader compile).
- **The wordmark is rendered twice by design:** the DOM `h1` (SEO, accessibility, LCP, no-JS) and a pixel-matched WebGL copy that takes over invisibly so the Flow can pass through it.

## Run it locally

```bash
cd portfolio && npm install && npm run build && npm start   # http://localhost:3000
# QA overrides: ?tier=high | medium | low | static
# First-visit intro again: open a new tab/window (it's per session)
```

## Phase 5 backlog (already identified, not started)

- Scene 02: route the loop so it doesn't cross the bio text, and add kinetic width-flow on "digital".
- Scene 03: align the Flow-built panels with the DOM capability cards; hover tilt; pin on desktop.
- Scene 04: real captures of the four showcases (replacing the placeholder art), depth gallery and the card → case-study transition.
- Scene 05: orbit nodes tied to the real tool list, plus the filter.
- Scene 06: magnetic CTA, portal brightening on hover.
- Global: custom cursor, magnetic buttons, View Transitions, OG images.
- Inputs still needed from you: contact email, socials, availability line, and confirmation of the tool list.
