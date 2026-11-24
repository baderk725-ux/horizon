#!/usr/bin/env bash
# Local hardening patches applied after installing upstream skills. Idempotent.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
S="$ROOT/.claude/skills"

# 1. nextjs (secondsky): upstream frontmatter pre-approves Bash/Write/Edit for the whole
#    session once the skill loads. Too broad for a reference skill -> remove the grant.
if [ -f "$S/nextjs/SKILL.md" ]; then
  sed -i '/^allowed-tools: \["Read", "Write", "Edit", "Bash", "Glob", "Grep"\]$/d' "$S/nextjs/SKILL.md"
fi

# 2. next-bundle-optimizer references next-cache-components-optimizer by URL and tells the
#    agent to `npx skills add` it if missing. It is installed locally; point at it.
if [ -f "$S/next-bundle-optimizer/SKILL.md" ]; then
  sed -i 's#install it first if unavailable (`npx skills add https://github.com/vercel/next.js/tree/canary/skills/next-cache-components-optimizer`)#it is installed locally in `.claude/skills/next-cache-components-optimizer`#' "$S/next-bundle-optimizer/SKILL.md"
fi

# 3. Shell scripts shipped by skills should be executable (they are never run automatically).
find "$S" -name '*.sh' -exec chmod 0755 {} +

# 4. build-threejs-scroll-worlds: the ~4 MB Kage demo (vendored three.min.js + images) is not
#    vendored here to keep the repo lean; point the link at the pinned upstream copy instead.
if [ -f "$S/build-threejs-scroll-worlds/SKILL.md" ]; then
  sed -i 's#\[Kage demo\](demo/index.html)#[Kage demo](https://github.com/MengTo/Skills/tree/409b4d04c98559bbd9d3344260e3a0878df30d43/agent-skills/web-design/build-threejs-scroll-worlds/demo) (not vendored locally; see upstream)#' "$S/build-threejs-scroll-worlds/SKILL.md"
fi

# 5. No skill may self-install other skills from unpinned branches. Replace any remaining
#    "install it first if unavailable (`npx skills add <url>`)" directive with a manifest pointer.
find "$S" -name SKILL.md -exec sed -i -E 's#install it first if unavailable \(`npx skills add [^`]+`\)#it is not installed in this project; ask the user before adding it via `scripts/skills/skills.manifest.tsv` (pinned commits only)#g' {} +
