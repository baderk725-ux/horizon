---
name: personal-brand-website
description: Positioning, messaging, voice and conversion strategy for premium personal-brand and portfolio websites (designers, developers, creative directors, freelancers, studios). Produces the brand context file other skills read. Use at the start of a portfolio project, when writing the homepage/about/contact, defining tagline, bio, tone of voice, or improving inquiries and hiring conversions from a personal site.
---

# Premium Personal Brand Website

A personal site has one job: make the *right* people think "I need to talk to this person", and make it effortless to do so. Everything else serves that.

## 1. Brand discovery interview

Ask these concisely, in batches. Reuse anything the user already said.

1. **Who you are professionally**: discipline(s), years, specialisms, notable clients or employers (only real ones).
2. **Who you want to attract**: client type or employer type, seniority of the buyer, industry, geography.
3. **What they hire you for**: the outcome, not the service ("launch-ready brand systems in 6 weeks", not "branding").
4. **Proof**: best projects, results, testimonials (with permission), awards, press, talks.
5. **Differentiator**: the point of view or method only you bring. Ask "what do you disagree with in your field?"
6. **Voice**: three words for how you sound and three for how you never sound. Do you write in first person?
7. **Primary action**: book a call, email, hire inquiry form, download CV or résumé, or follow. Pick **one** primary action and at most two secondary.
8. **Constraints**: availability status, location and time zone, languages, rates (shown or not).

## 2. Write the brand context file

Save it to `.agents/product-marketing.md`. The installed `copywriting`, `copy-editing`, `cro` and `schema` skills automatically read this path.

```
# Brand Context — <Name>
## Positioning
One-liner: I help <audience> <achieve outcome> through <distinctive approach>.
Category: <how they'd describe you to a colleague>
Differentiator / point of view:
## Audience
Primary: (role, context, what they skim for, objections)
Secondary:
## Proof
Projects (ranked), metrics (sourced), testimonials (attributed), recognition
## Voice
Is: … / Is not: … / Vocabulary to use / words to avoid
## Conversion
Primary CTA: … (destination) / Secondary CTAs: …
Availability line:
## Facts (canonical)
Full name, title, location, email, socials (URLs), sameAs profiles for schema
```

## 3. Messaging hierarchy for the homepage

1. **Hero statement** (≤ 12 words): what you do and for whom, in your voice. Avoid "Hi, I'm X, a passionate…". Name and role can live in the nav or meta line. Write 5 options with `copywriting` and pick with the user.
2. **Proof immediately**: selected work, or a client logo line if those clients are real and permitted.
3. **Point of view**: a short manifesto or approach section that differentiates.
4. **Services or capabilities** (for freelancers and studios): 3–5, outcome-phrased.
5. **Social proof**: 1–3 strong attributed quotes, not a carousel of ten.
6. **Contact chapter**: a big, confident CTA, a direct email (copy-to-clipboard), availability status and expected response time.

## 4. About page

- Open with your point of view, not your birthplace. Then the short career arc, how you work (process or principles), recognition, and something human (one or two specifics, not a hobby list).
- Include a portrait if the brand is personal. Art-direct it to match the site's treatment.
- Provide a downloadable CV or press kit if the audience includes recruiters or event organisers.

## 5. Conversion design

- The primary CTA is visible in the nav on every page, and repeated at the end of each case study and the homepage.
- Contact form: ≤ 4 fields (name, email, message, plus an optional budget/timeline select for freelancers). Use a mailto fallback. Show inline validation and a success state that sets expectations ("I reply within 2 working days").
- Remove friction: no CAPTCHA unless spam is proven. Use a honeypot field first.
- Availability badges ("Available from March 2027") are powerful only when true and kept updated. Store them in one config value.
- Track: CTA clicks, form starts and completions, email copy, and outbound clicks to profiles (privacy-friendly analytics, such as Vercel Analytics or Plausible). Hand optimisation to `cro`.

## 6. Identity consistency

- Use the same name, title, headshot and one-liner across the site, OG images and the `sameAs` social profiles.
- Person / ProfilePage JSON-LD built from the canonical facts block (`schema` skill). OG images are generated per page with brand type and colours (`next/og`).
- The favicon or monogram follows the art direction. Supply light and dark variants.

## 7. Quality bar

- [ ] A stranger can state who you help and how within 5 seconds of landing.
- [ ] Every claim is true, specific and attributable. Nothing is invented.
- [ ] The voice is consistent across hero, case studies, about, microcopy, 404 and form messages.
- [ ] There is one primary action, and it is reachable from everywhere in one click.
- [ ] The brand context file exists and is current, and copy was passed through `copy-editing`.
