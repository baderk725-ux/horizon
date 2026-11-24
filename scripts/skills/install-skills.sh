#!/usr/bin/env bash
# Reproducibly install the curated third-party skills listed in skills.manifest.tsv
# into .claude/skills/. Read-only toward the network except `git clone`/`git fetch`.
# Never executes any code from the fetched repositories.
#
# Usage: scripts/skills/install-skills.sh [--force]
#   --force  overwrite skills that already exist (default: skip existing, preserving local edits)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MANIFEST="$ROOT/scripts/skills/skills.manifest.tsv"
DEST="$ROOT/.claude/skills"
LOCK="$ROOT/.claude/skills/SOURCES.lock.tsv"
CACHE="${SKILLS_CACHE:-${TMPDIR:-/tmp}/claude-skill-sources}"
FORCE=0; [ "${1:-}" = "--force" ] && FORCE=1

mkdir -p "$DEST" "$CACHE"
printf "name\tcategory\trepo\tcommit\tpath\tlicense\n" > "$LOCK.tmp"

fetch() { # repo commit -> dir
  local repo="$1" commit="$2" dir="$CACHE/${1//\//_}@${2:0:12}"
  if [ ! -d "$dir/.git" ]; then
    git init -q "$dir"
    git -C "$dir" remote add origin "https://github.com/$repo.git"
    git -C "$dir" fetch -q --depth 1 origin "$commit"
    git -C "$dir" checkout -q FETCH_HEAD
  fi
  echo "$dir"
}

installed=0; skipped=0; failed=0
while IFS=$'\t' read -r name category repo commit path license excludes; do
  [[ -z "$name" || "$name" == \#* ]] && continue
  if [ -d "$DEST/$name" ] && [ $FORCE -eq 0 ]; then
    echo "skip  $name (exists)"; skipped=$((skipped+1))
    printf "%s\t%s\t%s\t%s\t%s\t%s\n" "$name" "$category" "$repo" "$commit" "$path" "$license" >> "$LOCK.tmp"
    continue
  fi
  if ! src="$(fetch "$repo" "$commit")" || [ ! -f "$src/$path/SKILL.md" ]; then
    echo "FAIL  $name ($repo@$commit:$path)"; failed=$((failed+1)); continue
  fi
  rm -rf "$DEST/$name"
  mkdir -p "$DEST/$name"
  # copy without symlinks being followed outside the tree
  (cd "$src/$path" && tar --exclude='.git' -cf - .) | (cd "$DEST/$name" && tar -xf -)
  if [ "$excludes" != "-" ]; then
    IFS=',' read -ra ex <<< "$excludes"
    for e in "${ex[@]}"; do rm -rf "${DEST:?}/$name/$e"; done
  fi
  # copy repo-level license if the skill has none
  if ! ls "$DEST/$name" | grep -qiE '^licen'; then
    for l in LICENSE LICENSE.md LICENSE.txt license.md; do
      [ -f "$src/$l" ] && { cp "$src/$l" "$DEST/$name/LICENSE.upstream"; break; }
    done
  fi
  printf "%s\t%s\t%s\t%s\t%s\t%s\n" "$name" "$category" "$repo" "$commit" "$path" "$license" >> "$LOCK.tmp"
  echo "ok    $name  <- $repo@${commit:0:7}"; installed=$((installed+1))
done < "$MANIFEST"

mv "$LOCK.tmp" "$LOCK"
"$ROOT/scripts/skills/post-install.sh"
echo "installed=$installed skipped=$skipped failed=$failed"
[ $failed -eq 0 ]
