---
name: portfolio-art-direction
description: Premium art direction for portfolio and personal-brand websites — defining a concept, visual language, typography, colour, grid, imagery, motion and 3D principles before any code. Use when starting a portfolio, when a design "looks generic/AI-made/template-like", when choosing fonts/palette/layout for a creative site, or when the user asks for award-winning, premium, editorial or cinematic design.
---

# Portfolio Art Direction

Award-winning portfolios are not decorated templates. They express **one idea, executed with conviction**. Your job here is to produce an **art-direction document** the user approves before building. `frontend-design` gives general aesthetic guidance and `no-ai-design-slop` lists defaults to avoid. This skill is the portfolio-specific process.

## 1. Extract the raw material (ask; don't invent)

- Who is this person? Discipline, seniority, and 3–5 adjectives they want associated with them.
- Who must be convinced? Hiring managers, agencies, clients, recruiters. What do those people skim for?
- The 3–6 strongest projects, and what is visually distinctive about each.
- Constraints: existing brand marks, colours, photography, accessibility needs, timeline.
- 3 sites they admire and 1 they dislike, and *why*. Treat references as inputs for principles, never as templates to copy.

## 2. Find the concept (the one idea)

Write a **concept line**: a metaphor or principle that every decision can be checked against. Examples of the *form* (don't reuse them):

- "A darkroom: work emerges from black as if developing."
- "An engineering notebook: precise grid, annotations, process visible."
- "A gallery at night: one lit object per room, silence between."

Offer 2–3 distinct concepts with a one-paragraph rationale each, and recommend one. Each concept must imply different typography, colour and motion. If two concepts would produce the same site, they are not distinct.

## 3. Define the visual language

Record each decision with a *because* tied to the concept.

**Typography**: the single biggest lever.
- One display face with real character (variable if possible) and one workhorse text face. Two families maximum, plus an optional mono for metadata.
- Avoid the overused defaults (Inter-only, Poppins, Montserrat, Space Grotesk as display) unless the concept demands neutrality and the scale and contrast do the work.
- Fluid type scale with `clamp()`. Display sizes can be extreme (8–20vw) when the concept calls for it. Body text is 16–20px with a 60–75ch measure.
- Tight display leading (0.85–1.0) and tracking tuned per size. Use tabular numerals for indexes and years.
- License check: the font must be licensed for web use. Self-host with `next/font/local` or `next/font/google`.

**Colour**: decide the *ratio*, not just the swatches.
- Base (60–80%), surface/contrast, and **one** accent used sparingly and meaningfully, for example the cursor, active state or a single highlight.
- Define colours in OKLCH for perceptual consistency. Verify AA contrast for text pairs.
- Per-project colour fields are a strong portfolio device: each case study gets its own tone.

**Grid & space**
- 12-column grid (4 on mobile) with generous outer margins (clamp 20px → 64px).
- Asymmetry on purpose: break the grid at designated moments, not randomly.
- Use a spacing scale based on one unit. Whitespace is a material: the more premium the concept, the more silence.

**Imagery**
- Art-direct crops (consistent aspect ratios per context), treatment (grain, duotone, none), and how media enters (mask, clip-path, scale).
- Prefer the work itself, large. Use device mockups only if they add meaning.

**Motion principles**: a short list such as "everything enters from darkness; nothing bounces; scroll is the timeline; transitions are cuts, not slides". Specify the easing family (for example, a custom expo-out), the duration range, and what never moves. `cinematic-web-development` and `advanced-gsap-animation` implement it.

**3D principles** (if any): what the 3D *means* in the concept, how much of the viewport it owns, and the static fallback.

**Signature moments**: 2–4 memorable interactions at most (for example: hero reveal, work-index hover preview, case-study transition, footer). Everything else stays quiet. Restraint is what makes signature moments land.

## 4. Deliverable: `docs/art-direction.md`

Write this file and present it for approval:

```
# Art Direction — <Name>
Concept line:
Audience & job-to-be-done:
Adjectives (do) / anti-adjectives (don't):
Typography: display / text / mono, scale, rules
Colour: tokens (OKLCH), ratios, per-project fields
Grid & spacing:
Imagery treatment:
Motion principles + easing/duration tokens:
3D role + fallback:
Signature moments (≤4):
Page list & hero concept per page:
References (with the principle taken from each):
Risks (performance, accessibility, content gaps):
```

## 5. Quality bar: self-critique before presenting

- Could this direction belong to anyone else? If yes, it isn't specific enough.
- Is there exactly one idea, and does every choice serve it?
- Does the work stay the hero, or does the site compete with it?
- Would the direction survive with motion off? It must.
- Run the `no-ai-design-slop` checklist against the direction. Purple-to-blue gradients, glassmorphism cards, emoji icons, centred-everything heroes and bento grids by default are disqualifying unless the concept demands them.
