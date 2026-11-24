# Final Skills & Environment Audit — Khaled Portfolio

**Date:** 2026-11-24  **Verdict:** ✅ ready for the creative-direction phase (awaiting approval)

## 1. Skills inventory

| Check | Result |
|---|---|
| Third-party skills | **51/51 valid.** Byte-identical to a fresh install from pinned commits (+ documented patches) |
| Custom skills | **10/10 valid.** 9 from setup + `reference-video-analysis` (new) |
| Total discovered by Claude Code | **61** (each appeared in the live skill listing when created) |
| Duplicate names | **0** (within the project, and against built-in and plugin skills: plugins are namespaced `plugin:skill`) |
| Frontmatter (name format, name = dir, description ≤ 1024) | All pass (`node scripts/skills/verify-skills.cjs`) |
| Project `settings.json` / user `~/.claude` | Untouched. No settings were created or overwritten |

### Issues found and fixed in this audit
1. **Stale cross-references in my custom skills**: 3 custom skills still referenced `react-view-transitions`, `composition-patterns` and `react-best-practices` after the earlier rename to `vercel-*`. **Fixed.**
2. **Unpinned self-install directives**: `next-bundle-optimizer` told the agent to `npx skills add` two more skills from the unpinned `canary` branch. **Neutralized** in `post-install.sh` (it now asks the user and points to the pinned manifest). The patch survives reinstalls.

### Known, accepted warnings
- `playwright-cli` declares `allowed-tools` limited to `playwright` commands. This is official Microsoft scoping and was kept.
- `playwright-cli` contains an example output path that looks like a broken link. It's documentation, not a dependency.
- **Soft "see also" references to uninstalled sibling skills** (e.g. `animate` → `improve-animations`; `nextjs` → `tanstack-query`; `build-threejs-scroll-worlds` → `scroll-world-storytelling`). They are informational only, and no workflow depends on them. Each was left out on purpose as an overlap.

## 2. Workflow readiness — verified by a real build, not assumed

A throwaway app (scratchpad, not committed) combined the entire stack in one page: Tailwind v4 tokens, a GSAP SplitText + ScrollTrigger scrub, Lenis, a Motion hover, a Lucide icon and an R3F canvas loaded client-only.

| Workflow | Status | Evidence |
|---|---|---|
| **Next.js 16.4.6 + React 19.3.1** | ✅ | `next build` succeeded and the route was prerendered static |
| **TypeScript 7.0.2** (new native compiler) | ✅ | Type-checks in 0.9 s, and a planted type error correctly **failed** the build |
| **Tailwind CSS 4.3.5** (`@tailwindcss/postcss`, `@theme`) | ✅ | Tokens compiled; utilities applied in the screenshot |
| **GSAP 3.15.1 + @gsap/react 2.1.2** (ScrollTrigger, SplitText) | ✅ | In the browser: lines split and masked; the scrubbed bar reached `scaleX(1)` after a wheel scroll |
| **Lenis 1.3.28** | ✅ | `html.lenis` active, no errors |
| **Motion 14.14.0** (`motion/react`), **Lucide 1.78.0** | ✅ | Rendered without errors |
| **three 0.187 + R3F 9.8.2 + drei 10.7.9** | ✅ | WebGL2 canvas rendered (R3F peer range `react >=19 <19.4` is satisfied) |
| **Playwright** (preinstalled 1.63.0, Chromium 1243) | ✅ | `portfolio-qa` ran on the production build: 0 blocking issues, 0 console errors |
| **Claude API** (for ORBIT) | ✅ skill / ⏸ key | The built-in `claude-api` skill and `@anthropic-ai/sdk` 1.13.0 are available. **Live calls need your API key (a paid service, so approval is required)** |
| ffmpeg 6.1, jq 1.7, Node 22.23, npm 10.9, git 2.43 | ✅ | Present |

**Lessons from the smoke test, carried forward:**
- Chrome or metal materials render **black without an environment map**. We'll self-host a small HDR (no runtime CDN fetch).
- Pin **`@playwright/test@1.63.0`** to match the preinstalled Chromium. WebKit and Firefox aren't preinstalled, so cross-browser runs need `npx playwright install webkit firefox` (a one-time download, done when we reach QA).
- `@react-three/postprocessing` 3.2.2 and `@react-three/rapier` 2.2.0 are available for grading/bloom and physics, but stay **off the mobile tier**.

## 3. Prioritized skills for this project

**Tier 1: always active (direction, process, quality)**
1. `creative-developer-workflow`: phase order, stack, quality gates
2. `portfolio-art-direction`: concept → `docs/art-direction.md`
3. `reference-video-analysis`: turned the reference into principles plus guardrails
4. `personal-brand-website`: positioning and voice → `.agents/product-marketing.md`
5. `no-ai-design-slop` + `frontend-design`: anti-generic gate
6. `portfolio-qa`: browser verification before every "done"

**Tier 2: build phases**
7. `cinematic-web-development` + `cinematic-gsap-lenis-motion-system`: experience layer and smooth scroll
8. `advanced-gsap-animation` + `gsap-scrolltrigger`, `gsap-react`, `gsap-plugins`, `gsap-core`, `gsap-timeline`
9. `interactive-3d-portfolio` + `build-threejs-scroll-worlds` + `threejs-react-three-fiber`, `threejs-materials`, `threejs-lighting`, `threejs-shaders`, `threejs-postprocessing`, `threejs-performance`
10. `nextjs`, `vercel-react-best-practices`, `vercel-composition-patterns`, `tailwind-v4-design-tokens`
11. `portfolio-case-study` + `copywriting`: the four concept projects
12. `motion` + `vercel-react-view-transitions`: UI-state animation and page transitions
13. Built-in `claude-api`: ORBIT assistant

**Tier 3: polish and audit**
14. `review-animations`, `animation-performance`, `emil-design-eng`, `choreograph`, `animate`
15. `accessibility`, `core-web-vitals`, `performance`, `seo`, `schema`, `next-bundle-optimizer`
16. `playwright-cli`, `web-design-guidelines`, `web-quality-audit`, `copy-editing`, `cro`

**Available but low relevance here:** `next-cache-components-optimizer` (needs Cache Components; the portfolio is static), `horizontal-scroll-scenes` (only if the direction uses one), `threejs-asset-pipeline`/`-loaders` (only if we ship glTF models), `site-architecture`, `best-practices`, `editorial-portfolio-chapters` (a reference pattern only).

## 4. Reference video

- Analysed: the uploaded `ScreenRecording_11-24-2026_06-29-31_1.mp4`. **`reference-video.mp4` and `weblove-reference.mp4` don't exist in the project.**
- It's a TikTok post filming a laptop, so the structure and techniques are reliable, but exact timing, type and colour are approximate.
- Breakdown: [`docs/research/weblove-reference-breakdown.md`](research/weblove-reference-breakdown.md), with frame evidence.

## 5. Information I'll need from you (no rush — needed by the build phases)
- Contact email and the social or professional links you want shown (GitHub, LinkedIn, X, etc.).
- A portrait photo (optional). If you don't supply one, the direction won't rely on it.
- Your preferred domain, and your GitHub/Vercel account names when we reach deployment.
- **Anthropic API key** for ORBIT's live Claude mode. This is a paid service, so it needs your approval; ORBIT will also work in a clearly labelled demo mode without it.
- Your actual tool list for the Technologies section (I'll draft one from the brief for you to correct; I won't add tools you don't use).
