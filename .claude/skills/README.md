# Project skills — creative portfolio workspace

There are 61 Claude Code skills here: 51 curated third-party skills, pinned to commits, and 10 custom ones. Claude Code discovers each `<name>/SKILL.md` automatically. The directory must stay flat, so the categories below are logical groupings, not folders.

- Provenance (repo, commit, path, license): [`SOURCES.lock.tsv`](SOURCES.lock.tsv)
- Reinstall or upgrade: `scripts/skills/install-skills.sh [--force]` (manifest: `scripts/skills/skills.manifest.tsv`)
- Validate: `node scripts/skills/verify-skills.cjs --list`

**Start every portfolio task with `creative-developer-workflow`.** It routes to everything else.

| Category | Skills |
|---|---|
| **Workflow (custom)** | `creative-developer-workflow` |
| **Research** | `reference-video-analysis`★ (ffmpeg frame breakdown → techniques → originality guardrails) |
| **AI application development** | `claude-api` (built into Claude Code, official Anthropic; deliberately *not* duplicated here) |
| **Art direction & UI/UX** | `portfolio-art-direction`★, `frontend-design` (Anthropic), `no-ai-design-slop`, `web-design-guidelines` (Vercel), `emil-design-eng` |
| **Frontend / React / Next.js** | `nextjs`, `vercel-react-best-practices`, `vercel-composition-patterns`, `next-bundle-optimizer`, `next-cache-components-optimizer` (official Next.js), `tailwind-v4-design-tokens`★ |
| **Animation & motion** | `advanced-gsap-animation`★, `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-react`, `gsap-performance` (official GreenSock), `motion`, `vercel-react-view-transitions`, `animate`, `choreograph`, `review-animations`, `animation-performance` |
| **Cinematic / advanced web** | `cinematic-web-development`★, `cinematic-gsap-lenis-motion-system`, `horizontal-scroll-scenes`, `editorial-portfolio-chapters` |
| **3D & WebGL** | `interactive-3d-portfolio`★, `build-threejs-scroll-worlds`, `threejs-fundamentals`, `threejs-react-three-fiber`, `threejs-shaders`, `threejs-postprocessing`, `threejs-materials`, `threejs-lighting`, `threejs-textures`, `threejs-geometry`, `threejs-loaders`, `threejs-animation`, `threejs-interaction`, `threejs-performance`, `threejs-asset-pipeline` |
| **SEO & performance** | `seo`, `schema`, `core-web-vitals`, `performance` |
| **QA** | `portfolio-qa`★ (with `scripts/qa.cjs`), `playwright-cli` (Microsoft), `accessibility`, `best-practices`, `web-quality-audit` |
| **Brand, content & conversion** | `personal-brand-website`★, `portfolio-case-study`★, `copywriting`, `copy-editing`, `cro`, `site-architecture` |

★ = custom skill written for this workspace.

## Local modifications to upstream skills (applied by `scripts/skills/post-install.sh`)

1. `nextjs`: removed a frontmatter `allowed-tools` grant that pre-approved Bash/Write/Edit for the session.
2. `next-bundle-optimizer`: points to the locally installed `next-cache-components-optimizer` instead of running `npx skills add`.
3. `build-threejs-scroll-worlds`: the 4 MB demo (vendored three.js and images) isn't copied; its link points to the pinned upstream copy.
4. Excluded preview images and `agents/openai.yaml` (Codex-only) from the MengTo skills.

## Shared context files read by skills

- `.agents/product-marketing.md`: brand context written by `personal-brand-website`, read by `copywriting`, `copy-editing`, `cro` and `schema`.
- `docs/art-direction.md`: written by `portfolio-art-direction`, read by the motion, 3D, tokens and QA skills.
