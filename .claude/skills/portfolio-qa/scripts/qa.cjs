#!/usr/bin/env node
/*
 * Portfolio QA sweep (read-only toward the site under test).
 * Usage: node qa.cjs <url> [--out <dir>] [--widths 360,768,1024,1440,1920] [--axe]
 *
 * Per viewport: full-page screenshot, console errors, page errors, failed requests,
 * horizontal overflow (+ offending elements), basic a11y/SEO structure, LCP/CLS.
 * Also runs one pass with prefers-reduced-motion: reduce.
 * --axe: inject axe-core if `axe-core` is resolvable (npm i -D axe-core); otherwise skipped.
 * Writes <out>/report.json and screenshots; prints a summary; exit 1 on blocking issues.
 */
const fs = require("fs");
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright")); }
catch { console.error("playwright not found: npm i -D playwright (then npx playwright install chromium)"); process.exit(2); }

const args = process.argv.slice(2);
const valued = new Set(["--out", "--widths"]);
const url = args.find((a, i) => !a.startsWith("--") && !valued.has(args[i - 1]));
if (!url) { console.error("Usage: node qa.cjs <url> [--out dir] [--widths 360,768] [--axe]"); process.exit(2); }
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const out = path.resolve(opt("--out", "qa-report"));
const widths = opt("--widths", "360,768,1024,1440,1920").split(",").map(Number);
const useAxe = args.includes("--axe");
fs.mkdirSync(out, { recursive: true });

async function audit(browser, width, reducedMotion) {
  const height = width < 768 ? 800 : 900;
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1,
    reducedMotion: reducedMotion ? "reduce" : "no-preference", hasTouch: width < 768 });
  const page = await ctx.newPage();
  const consoleErrors = [], pageErrors = [], failedRequests = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  page.on("requestfailed", (r) => failedRequests.push(`${r.failure()?.errorText} ${r.url()}`));
  page.on("response", (r) => r.status() >= 400 && failedRequests.push(`${r.status()} ${r.url()}`));
  await page.addInitScript(() => {
    window.__cwv = { lcp: 0, cls: 0 };
    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__cwv.lcp = e.startTime; })
        .observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cwv.cls += e.value; })
        .observe({ type: "layout-shift", buffered: true });
    } catch {}
  });
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1500);
  // Read LCP BEFORE scrolling: programmatic scroll is not user input, so LCP would keep updating.
  const lcpBeforeScroll = await page.evaluate(() => window.__cwv.lcp);
  // scroll through the page to trigger lazy content / scroll animations, then back to top
  await page.evaluate(async () => {
    const step = innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    scrollTo(0, 0); await new Promise((r) => setTimeout(r, 400));
  });
  const checks = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const overflowing = [...document.querySelectorAll("body *")].filter((el) => {
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      return r.width > 0 && (r.right > vw + 1 || r.left < -1) && cs.position !== "fixed";
    }).slice(0, 8).map((el) => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""));
    const q = (s) => document.querySelectorAll(s);
    const named = (el) => (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.textContent.trim() || el.querySelector("img[alt]:not([alt=''])") || el.title);
    const smallTargets = [...q("a, button, [role=button], input, select, textarea")].filter((el) => {
      const r = el.getBoundingClientRect(); if (r.width <= 1 && r.height <= 1) return false; /* visually hidden (sr-only) control; its label is the target */ return r.width > 0 && r.height > 0 && (r.width < 24 || r.height < 24);
    }).length;
    return {
      horizontalOverflow: document.documentElement.scrollWidth > vw + 1, overflowing,
      lang: document.documentElement.lang || null, title: document.title || null,
      metaDescription: document.querySelector('meta[name="description"]')?.content || null,
      canonical: document.querySelector('link[rel="canonical"]')?.href || null,
      ogImage: document.querySelector('meta[property="og:image"]')?.content || null,
      jsonLd: q('script[type="application/ld+json"]').length,
      h1Count: q("h1").length, mainLandmark: q("main").length,
      imgMissingAlt: [...q("img")].filter((i) => !i.hasAttribute("alt")).length,
      unnamedLinksButtons: [...q("a[href], button")].filter((e) => !named(e)).length,
      smallTargets, cwv: { ...window.__cwv },
    };
  });
  let axe = null;
  if (useAxe) {
    try {
      await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js", { paths: [process.cwd(), __dirname] }) });
      const r = await page.evaluate(async () => await window.axe.run(document, { resultTypes: ["violations"] }));
      axe = r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help }));
    } catch (e) { axe = `skipped: ${e.code === "MODULE_NOT_FOUND" ? "axe-core not installed (npm i -D axe-core)" : e.message}`; }
  }
  const shot = path.join(out, `${width}${reducedMotion ? "-reduced" : ""}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  await ctx.close();
  checks.cwv.lcp = lcpBeforeScroll;
  return { width, reducedMotion, screenshot: shot, consoleErrors, pageErrors, failedRequests, ...checks, axe };
}

(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const w of widths) results.push(await audit(browser, w, false));
  results.push(await audit(browser, widths.includes(1440) ? 1440 : widths[widths.length - 1], true));
  await browser.close();

  const blocking = [], warnings = [];
  for (const r of results) {
    const tag = `${r.width}px${r.reducedMotion ? " (reduced-motion)" : ""}`;
    if (r.horizontalOverflow) blocking.push(`${tag}: horizontal overflow — ${r.overflowing.join(", ")}`);
    if (r.pageErrors.length) blocking.push(`${tag}: ${r.pageErrors.length} uncaught JS error(s): ${r.pageErrors[0]}`);
    if (r.consoleErrors.length) warnings.push(`${tag}: ${r.consoleErrors.length} console error(s): ${r.consoleErrors[0]}`);
    if (r.failedRequests.length) warnings.push(`${tag}: ${r.failedRequests.length} failed request(s): ${r.failedRequests[0]}`);
    if (r.cwv.cls > 0.1) warnings.push(`${tag}: CLS ${r.cwv.cls.toFixed(3)} > 0.1`);
    if (r.smallTargets && r.width < 768) warnings.push(`${tag}: ${r.smallTargets} interactive target(s) < 24px`);
    if (typeof r.axe === "string" && r === results[0]) warnings.push(`axe ${r.axe}`);
    if (Array.isArray(r.axe) && r.axe.length) blocking.push(`${tag}: axe ${r.axe.length} violation(s): ${r.axe.map((v) => v.id).join(", ")}`);
  }
  const f = results[0];
  if (!f.lang) blocking.push("missing <html lang>");
  if (!f.title) blocking.push("missing <title>");
  if (f.h1Count !== 1) warnings.push(`h1 count is ${f.h1Count} (expected 1)`);
  if (!f.mainLandmark) warnings.push("no <main> landmark");
  if (f.imgMissingAlt) blocking.push(`${f.imgMissingAlt} <img> without alt`);
  if (f.unnamedLinksButtons) blocking.push(`${f.unnamedLinksButtons} link/button(s) without accessible name`);
  for (const [k, v] of Object.entries({ metaDescription: f.metaDescription, canonical: f.canonical, ogImage: f.ogImage }))
    if (!v) warnings.push(`missing ${k}`);
  if (!f.jsonLd) warnings.push("no JSON-LD structured data");

  const report = { url, generatedAt: new Date().toISOString(), blocking, warnings, results };
  fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2));
  console.log(`QA ${url}\nscreenshots + report: ${out}`);
  console.log(`\nBLOCKING (${blocking.length})`); blocking.forEach((b) => console.log("  ✗ " + b));
  console.log(`\nWARNINGS (${warnings.length})`); warnings.forEach((w) => console.log("  ! " + w));
  console.log(`\nLCP(ms) by width: ${results.map((r) => `${r.width}${r.reducedMotion ? "r" : ""}=${Math.round(r.cwv.lcp)}`).join("  ")}`);
  process.exit(blocking.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
