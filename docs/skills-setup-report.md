# Skills Setup Report — Creative Portfolio Workspace

**Date:** 2026-11-24  **Scope:** project-level `.claude/skills/`  **Status:** complete. All 60 skills are valid and discovered by Claude Code.

## Summary

| Metric | Count |
|---|---|
| Source repositories evaluated | 15 |
| Candidate skills discovered (SKILL.md files reviewed) | ~420 |
| Shortlisted and security-audited | 67 |
| **Third-party skills installed** | **51** |
| **Custom skills created** | **9** |
| **Total project skills** | **60** |
| Installation failures | 0 |
| New software dependencies installed | 0 (Playwright 1.63, jq, Node 22 were already present) |

## Sources used (all MIT or Apache-2.0, pinned to commits)

| Source | Trust basis | Installed |
|---|---|---|
| anthropics/skills | Official Anthropic | frontend-design |
| vercel-labs/agent-skills | Official Vercel | vercel-react-best-practices, vercel-composition-patterns, vercel-react-view-transitions, web-design-guidelines |
| vercel/next.js `skills/` | Official Next.js (version-matched to the framework) | next-bundle-optimizer, next-cache-components-optimizer |
| greensock/gsap-skills | Official GSAP | gsap-core, -timeline, -scrolltrigger, -plugins, -utils, -react, -performance |
| microsoft/playwright-cli | Official Microsoft | playwright-cli |
| addyosmani/web-quality-skills | Addy Osmani (Chrome team) | seo, performance, core-web-vitals, accessibility, best-practices, web-quality-audit |
| emilkowalski/skill | Emil Kowalski (author of Sonner and Vaul) | emil-design-eng, animate, choreograph, review-animations, animation-performance |
| CloudAI-X/threejs-skills | Widely-used three.js set, updated Oct 2026, WebGPU/TSL-aware | 13 threejs-* skills |
| MengTo/Skills | Meng To (Design+Code) | cinematic-gsap-lenis-motion-system, editorial-portfolio-chapters, horizontal-scroll-scenes, build-threejs-scroll-worlds, no-ai-design-slop |
| coreyhaines31/marketingskills | Leading marketing skill set | copywriting, copy-editing, cro, schema, site-architecture |
| secondsky/claude-skills | Active community set (Nov 2026) | nextjs (Next 16), motion (Motion/Framer Motion) |

## Custom skills

| Skill | Fills the gap for |
|---|---|
| creative-developer-workflow | Phase order, stack defaults, TypeScript standards, quality gates, skill routing |
| portfolio-art-direction | Premium art direction: concept, type, colour, grid, motion and 3D principles → `docs/art-direction.md` |
| cinematic-web-development | Lenis↔GSAP bridge, preloaders, page transitions, custom cursor, magnetic UI, experimental nav, reduced-motion |
| advanced-gsap-animation | Portfolio GSAP recipes: SplitText, pinned chapters, horizontal scroll, Flip, quickTo, velocity skew |
| interactive-3d-portfolio | When 3D earns its place, R3F architecture in Next.js, budgets, quality tiers, fallbacks |
| portfolio-case-study | Case-study narrative, writing rules, presentation, content model, CreativeWork schema |
| personal-brand-website | Positioning, voice, conversion; writes `.agents/product-marketing.md`, which the copy, CRO and schema skills read |
| tailwind-v4-design-tokens | Tailwind v4 CSS-first `@theme` tokens for Next.js (no current, trustworthy upstream skill existed) |
| portfolio-qa | Multi-viewport QA script (`scripts/qa.cjs`, tested) + manual motion/3D/a11y checklist |

## Rejected or deduplicated (and why)

- **webapp-testing** (Anthropic), **playwright-skill** (lackeyjb): overlap with the official `playwright-cli`. webapp-testing also needs Python Playwright, which isn't installed.
- **ui-ux-pro-max**: 81 files with Python scripts; overlaps frontend-design, no-ai-design-slop and web-design-guidelines.
- **gsap-frameworks**: covers Vue and Svelte only; the target stack is React.
- **seo-audit, ai-seo** (Corey Haines): overlap with addyosmani `seo`.
- **cinematic-scroll-storytelling, audit-ai-design-slop** (MengTo): overlap with the installed siblings.
- **improve-animations, find-animation-opportunities, gestures, animation-vocabulary** (Emil): overlap with review-animations and animate.
- **tailwind-v4-shadcn** (secondsky): Vite-specific, last updated Dec 2025 → replaced by a custom Next.js-oriented skill.
- **next-dev-loop** (Next.js): hard-requires the `agent-browser` CLI and Next 16.3; `portfolio-qa` + `playwright-cli` cover runtime checks.
- **freshtechbro/claudedesignskills**: last updated Nov 2025; superseded by official GSAP and current three.js sets.
- No official Lenis skill exists (darkroomengineering ships none). Lenis is covered by cinematic-gsap-lenis-motion-system and the custom cinematic skill.

## Security review

- All shortlisted files were scanned for piped installers, `rm -rf`, encoded payloads, credential paths, exfil endpoints, injection text and frontmatter permission grants. None were malicious.
- **Hardened:** `nextjs` upstream frontmatter pre-approved `Bash/Write/Edit`. That grant was removed.
- `playwright-cli` keeps its official, narrowly scoped `allowed-tools` (playwright commands only).
- No installer code from any repository was executed. Files were copied from pinned commits only.

## Verification

- `node scripts/skills/verify-skills.cjs` → **60 skills, 0 errors**. Names are unique, each name matches its directory, and descriptions are ≤ 1024 characters.
- A clean reinstall from the manifest was byte-identical to the working tree.
- The Claude Code harness listed all 60 skills live, and Skill-tool invocation was tested on a custom skill (`portfolio-qa`) and a third-party one (`gsap-performance`).
- `portfolio-qa/scripts/qa.cjs` was run against the current `index.html`: it produced screenshots and a report, and correctly flagged missing `<main>`, meta description, canonical, OG and JSON-LD.

## Requires manual configuration (optional)

1. **axe-core** for automated a11y rules in `portfolio-qa --axe`: `npm i -D axe-core` once the portfolio has a `package.json`.
2. **Playwright outside this cloud container**: `npm i -D playwright && npx playwright install chromium`.
3. **next-cache-components-optimizer** requires Next.js 16.3+ with Cache Components enabled.
4. **next-bundle-optimizer** uses `next analyze` (Next 16+).

## Remaining recommendations

- Overlapping **session plugins** are also enabled (e.g. `frontend-design:frontend-design`, `vercel:nextjs`, `vercel:shadcn`, `design-skills:*`, `vectorlab-ux-skills:*`, `searchfit-seo:*`). They are namespaced, so there are no name collisions. If skill selection feels noisy, consider disabling unused plugins.
- Context budget: 60 skill descriptions plus the plugin skills is a lot. If Claude Code starts omitting skills from its listing, trim the threejs set to the ones the project actually uses.
- Upgrades: bump commits in `scripts/skills/skills.manifest.tsv`, run `install-skills.sh --force`, review the diff, and run the verifier.
- Next step: start the portfolio with `creative-developer-workflow` → Phase 0 (`personal-brand-website` interview).
