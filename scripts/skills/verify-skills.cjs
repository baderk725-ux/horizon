#!/usr/bin/env node
// Validate .claude/skills: frontmatter, naming, duplicates, description limits, broken local links.
// Usage: node scripts/skills/verify-skills.cjs [--list]
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, "../..");
const dir = path.join(root, ".claude/skills");
const errors = [], warns = [], rows = [];
const names = new Map(), descs = new Map();

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {}; const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let [, k, v] = kv;
    if (/^([>|]-?)?$/.test(v)) { // folded/literal block or plain multi-line scalar
      const buf = []; while (i + 1 < lines.length && /^\s+\S|^\s*$/.test(lines[i + 1])) buf.push(lines[++i].trim());
      v = buf.join(" ").trim();
    }
    fm[k] = v.replace(/^["']|["']$/g, "");
  }
  return fm;
}

const lock = new Map();
const lockFile = path.join(dir, "SOURCES.lock.tsv");
if (fs.existsSync(lockFile)) for (const l of fs.readFileSync(lockFile, "utf8").trim().split("\n").slice(1)) { const c = l.split("\t"); lock.set(c[0], c); }

for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
  if (!d.isDirectory()) continue;
  const p = path.join(dir, d.name, "SKILL.md");
  if (!fs.existsSync(p)) { errors.push(`${d.name}: no SKILL.md`); continue; }
  const text = fs.readFileSync(p, "utf8");
  const fm = frontmatter(text);
  if (!fm) { errors.push(`${d.name}: missing YAML frontmatter`); continue; }
  if (!fm.name) errors.push(`${d.name}: frontmatter has no name`);
  else {
    if (!/^[a-z0-9-]{1,64}$/.test(fm.name)) errors.push(`${d.name}: invalid name "${fm.name}"`);
    if (fm.name !== d.name) warns.push(`${d.name}: name "${fm.name}" differs from directory (invoked as ${fm.name})`);
    if (names.has(fm.name)) errors.push(`duplicate skill name "${fm.name}" (${names.get(fm.name)}, ${d.name})`);
    names.set(fm.name, d.name);
  }
  const desc = fm.description || "";
  if (!desc) errors.push(`${d.name}: empty description`);
  if (desc.length > 1024) errors.push(`${d.name}: description ${desc.length} > 1024 chars`);
  if (descs.has(desc) && desc) errors.push(`${d.name}: identical description to ${descs.get(desc)}`);
  descs.set(desc, d.name);
  if (/^allowed-tools:/m.test(text.split(/^---$/m)[1] || "")) warns.push(`${d.name}: declares allowed-tools (${(text.match(/^allowed-tools:(.*)$/m) || [])[1]?.trim()})`);
  // relative markdown links to local files must exist
  for (const m of text.matchAll(/\]\((?!https?:|#|mailto:|\/)([^)\s]+)\)/g)) {
    const target = m[1].split("#")[0];
    if (target && !fs.existsSync(path.join(dir, d.name, target))) warns.push(`${d.name}: broken link -> ${target}`);
  }
  const files = []; (function walk(x) { for (const e of fs.readdirSync(x, { withFileTypes: true })) e.isDirectory() ? walk(path.join(x, e.name)) : files.push(e.name); })(path.join(dir, d.name));
  const src = lock.get(d.name);
  rows.push({ skill: d.name, origin: src ? `${src[2]}@${src[3].slice(0, 7)}` : "custom", category: src ? src[1] : "custom", files: files.length, lines: text.split("\n").length });
}

if (process.argv.includes("--list")) {
  rows.sort((a, b) => a.category.localeCompare(b.category) || a.skill.localeCompare(b.skill));
  for (const r of rows) console.log(`${r.category.padEnd(16)} ${r.skill.padEnd(36)} ${r.origin.padEnd(40)} files=${String(r.files).padEnd(4)} lines=${r.lines}`);
}
console.log(`\nskills=${rows.length} (custom=${rows.filter((r) => r.origin === "custom").length}, third-party=${rows.filter((r) => r.origin !== "custom").length})`);
warns.forEach((w) => console.log("WARN  " + w));
errors.forEach((e) => console.log("ERROR " + e));
console.log(errors.length ? `FAILED with ${errors.length} error(s)` : "OK: all skills valid");
process.exit(errors.length ? 1 : 0);
