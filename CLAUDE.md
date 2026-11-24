# Horizon — Claude Code project guide

This repo is a creative web-development workspace for premium, cinematic, interactive portfolio websites.

## Skills

- Project skills live in `.claude/skills/` (index: `.claude/skills/README.md`).
- For any portfolio or creative-site work, load `creative-developer-workflow` first. It defines the phase order, default stack, quality gates and which specialist skill to use at each step.
- Third-party skills are pinned in `scripts/skills/skills.manifest.tsv`. Don't hand-edit them. Change the manifest or `post-install.sh`, then re-run `scripts/skills/install-skills.sh --force`.
- After adding or editing skills, run `node scripts/skills/verify-skills.cjs`.

## Non-negotiables for site work

- Approve the art direction (`docs/art-direction.md`) with the user before building.
- Build a complete, accessible static layer before adding motion or 3D. Respect `prefers-reduced-motion`.
- Use real content only: never invent clients, metrics, testimonials or awards.
- Verify visually in a real browser (`portfolio-qa`) before calling anything done.
