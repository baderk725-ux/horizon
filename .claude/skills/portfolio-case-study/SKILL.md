---
name: portfolio-case-study
description: Structuring, writing and presenting portfolio case studies and project pages — narrative arc, scannable hierarchy, outcome evidence, media sequencing, content model (MDX/TS), metadata and CreativeWork schema. Use when writing or redesigning a project/case-study page, a work index, project cards, or when turning raw project notes into a compelling story.
---

# Portfolio Case Study Presentation

A case study must work at three reading depths: **5 seconds** (what is it, why it matters), **30 seconds** (the problem, your role, the result) and **5 minutes** (process, decisions, craft). Most visitors only get to the first two depths, so design for them first.

## 1. Gather facts (never fabricate)

Ask the user for these, and leave clearly-marked `TODO` placeholders where facts are missing. Never invent metrics, clients, awards or quotes.

- Project name, client or context, year, duration, team, and **your exact role**.
- The problem in the client's or user's terms, plus constraints (time, budget, tech, politics).
- 2–4 key decisions and *why* (alternatives considered).
- Outcome: quantitative (with source and timeframe) and/or qualitative (a quote with attribution and permission).
- Media inventory: hero visual, process artefacts, final shots, video. Note any NDA limits.

## 2. Narrative arc (default; adapt to the project)

1. **Hero**: title, one-line outcome-led summary, and the strongest visual. Meta row: Role · Client · Year · Services (and a live link if public).
2. **Context & challenge**: 2–4 sentences. What was at stake?
3. **Approach**: the insight or idea that unlocked it. This is where the voice and point of view live.
4. **Key decisions**: 2–4 blocks, each with a heading that states the decision, a short rationale and a supporting visual.
5. **Craft details**: close-ups, motion clips, system pieces (type, components, interactions). Show, don't tell.
6. **Outcome**: metrics, quotes, recognition, and what changed.
7. **Reflection** (optional, 1–3 sentences): what you'd do next. It signals seniority.
8. **Next project**: a large, inviting link to keep the visitor moving. It is the best place for a signature transition.

## 3. Writing rules

- Lead with outcomes and decisions, not chronology ("We redesigned onboarding → activation +18% in 6 weeks", not "First we did research…").
- Write in the first person, singular for your own work and plural for team work, with your contribution explicit.
- Headings carry the story on their own. Someone reading only the headings should get the arc.
- Paragraphs ≤ 4 lines. Use specific nouns and verbs. Cut adjectives like "innovative", "seamless" and "cutting-edge".
- Hand the draft to `copywriting` for headline options and `copy-editing` for a tightening pass.

## 4. Visual presentation

- Alternate rhythm: full-bleed → text + media split → grid of details → full-bleed. Avoid long runs of the same layout.
- Every media block gets a caption that explains *why it matters*, not just what it is.
- Keep a consistent aspect-ratio system (for example 16:9 hero, 4:5 details, 1:1 grid). Always reserve space (no CLS).
- Use a per-project accent colour or colour field (from the art direction) to give each study its own identity within the system.
- Video: muted, `playsinline`, poster frame, lazy, with a pause control. Prefer short loops (≤ 8s, ≤ 2MB) for craft details.
- Motion: reveals support reading order. Pin a chapter only when scroll is genuinely telling a sequence (before/after, process steps).

## 5. Work index (listing page)

- Show 4–8 selected projects, not everything. Put the strongest first.
- Each entry: title, one-line outcome or descriptor, discipline tags, year, and a visual (or a hover preview on desktop with inline images on touch).
- Offer filtering only when there are more than 8 projects across distinct disciplines. Use Flip for filter transitions.

## 6. Content model

```ts
// content/work/<slug>.mdx frontmatter, validated at build time
export interface CaseStudy {
  slug: string; title: string; summary: string;           // summary ≤ 160 chars → meta description
  client?: string; year: number; role: string[]; services: string[];
  team?: string[]; link?: string; accent?: string;          // OKLCH token
  cover: { src: string; alt: string; width: number; height: number };
  outcomes?: { label: string; value: string; source?: string }[];
  featured: boolean; order: number; nda?: boolean;
}
```

- Routes: `/work/[slug]` with `generateStaticParams`. Use `generateMetadata` to produce the title ("<Project> — <Name>"), the description from `summary` and an OG image.
- JSON-LD per case study: `CreativeWork` (name, description, creator → Person, dateCreated, image, url, keywords from services). See the `schema` skill.
- The previous/next order comes from `order`.

## 7. Quality checklist

- [ ] The 5-second test: a stranger can say what the project was and why it was good from the hero alone.
- [ ] Your role is explicit and every claim is factual and attributable.
- [ ] Headings alone tell the story.
- [ ] Every image has meaningful alt text (decorative images get `alt=""`) and captions where useful.
- [ ] The page works with motion off and on mobile. Media is optimized (AVIF/WebP, responsive `sizes`).
- [ ] It ends with a strong next-project link and a contact CTA.
