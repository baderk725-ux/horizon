"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { flow, onFlowReady } from "@/lib/flow-store";
import { motion } from "@/lib/motion-tokens";
import { wordmarkState } from "@/components/three/Wordmark3D";
import { detectTier } from "@/components/three/quality";

/**
 * SCENE 01 — the opening (docs/preproduction/storyboard-motion-spec.md, rows 1.1–1.8).
 * First visit: black veil only while the scene initialises (≤ 1.0s incl. fade; the counter appears
 * only if init takes > 300ms) → gathering → letter rise → lines → nav.
 * Repeat visit: no veil, no letter rise; particles gather, wordmark crossfades DOM → WebGL.
 * Content is visible by default; this only ever animates it in, with timeouts as failsafes.
 */
export function Intro() {
  const veilRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const tier = detectTier();
    const animated = html.classList.contains("motion") && tier !== "none" && tier !== "static";
    const firstVisit = html.classList.contains("first-visit") && animated;
    const h1 = document.querySelector<HTMLElement>("[data-wordmark]");
    const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
    const header = document.querySelector<HTMLElement>("header");
    const ctx = gsap.context(() => {});

    try {
      sessionStorage.setItem("k-visited", "1");
    } catch {}

    // Static / reduced-motion / no WebGL: everything visible, Flow gathered.
    if (!animated) {
      flow.intro = 1;
      flow.letters = flow.letters.map(() => 1);
      return;
    }

    const waitForWordmark = (timeoutMs: number) =>
      new Promise<boolean>((resolve) => {
        const start = performance.now();
        const check = () => {
          if (flow.ready && wordmarkState.ready) return resolve(true);
          if (performance.now() - start > timeoutMs) return resolve(false);
          requestAnimationFrame(check);
        };
        check();
      });

    const takeOver = (on: boolean, duration = 0) => {
      if (!h1) return;
      ctx.add(() => {
        gsap.to(flow, { wordmark: on ? 1 : 0, duration, ease: "none" });
        gsap.to(h1, { opacity: on ? 0 : 1, duration, ease: "none" });
      });
    };

    // Repeat visit (or first visit whose JS arrived after the veil budget):
    // gather + seamless DOM → WebGL crossfade, no hidden content.
    const seamless = () => {
      const unsub = onFlowReady(() => ctx.add(() => gsap.to(flow, { intro: 1, duration: 1.8, ease: "power2.inOut" })));
      waitForWordmark(4000).then((ok) => {
        if (!ok) return;
        flow.letters = flow.letters.map(() => 1);
        takeOver(true, 0.3);
      });
      return unsub;
    };

    // Veil budget (Khaled, 2026-11-24): never a forced wait. The black screen exits the moment the
    // scene is ready and is fully gone ≤ VEIL_MAX_MS after navigation, fade included.
    // globals.css enforces the same cap without JS; the counter only appears after 300ms.
    const VEIL_MAX_MS = 1000;
    const VEIL_FADE_S = 0.35;
    const waitBudget = VEIL_MAX_MS - VEIL_FADE_S * 1000 - performance.now();

    if (!firstVisit || waitBudget < 60) {
      if (firstVisit && veilRef.current) gsap.set(veilRef.current, { autoAlpha: 0 });
      const unsub = seamless();
      return () => {
        unsub();
        ctx.revert();
      };
    }

    // ---------- First visit, within budget
    window.dispatchEvent(new CustomEvent("k:scroll-lock", { detail: true }));
    html.style.overflow = "hidden";
    const counter = { v: 0 };
    const writeCount = () => countRef.current && (countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0"));
    ctx.add(() => {
      // The LCP candidate (offer line) is never hidden on mobile — only moved — so LCP isn't delayed.
      gsap.set(lines, { y: 24 });
      const lcpSafe = window.innerWidth < 768; // on mobile the offer line is the LCP element; on desktop it's the wordmark
      gsap.set(lines.filter((l) => !(lcpSafe && l.hasAttribute("data-lcp"))), { opacity: 0 });
      if (header) gsap.set(header, { opacity: 0 });
      gsap.to(counter, { v: 99, duration: Math.max(0.1, waitBudget / 1000), ease: "power1.out", onUpdate: writeCount });
    });

    let cancelled = false;
    let lateUnsub: (() => void) | undefined;
    waitForWordmark(waitBudget).then((ok) => {
      if (cancelled) return;
      ctx.add(() => {
        const tl = gsap.timeline();
        tl.add(() => {
          gsap.killTweensOf(counter);
          counter.v = 100;
          writeCount();
          // Hand the wordmark to WebGL (letters still below their masks) under the veil
          if (ok) {
            flow.wordmark = 1;
            if (h1) gsap.set(h1, { opacity: 0 });
          }
        });
        tl.to(veilRef.current, { autoAlpha: 0, duration: VEIL_FADE_S, ease: "cine" });
        tl.add(() => {
          html.style.overflow = "";
          window.dispatchEvent(new CustomEvent("k:scroll-lock", { detail: false }));
          // Scene wasn't ready inside the budget: DOM wordmark stays; hand over seamlessly when ready.
          if (!ok) lateUnsub = seamless();
        });
        const t0 = tl.duration() - 0.2; // overlap the veil's exit
        // 1.2 gathering (starts dim, settles on the ribbon)
        tl.to(flow, { intro: 1, duration: 2.4, ease: "power2.inOut" }, t0);
        // 1.3 letter rise (WebGL, in depth)
        if (ok) {
          flow.letters.forEach((_, i) => {
            tl.to(flow.letters, { [i]: 1, duration: 1.1, ease: "flow" }, t0 + 0.9 + i * motion.stagger.letters);
          });
        }
        // 1.5 statement + CTAs
        tl.to(lines, { opacity: 1, y: 0, duration: motion.dur.reveal, stagger: motion.stagger.lines, ease: "flow" }, t0 + 1.6);
        // 1.6 nav + HUD
        if (header) tl.to(header, { opacity: 1, duration: motion.dur.ui, ease: "none" }, t0 + 1.9);
      });
    });

    return () => {
      cancelled = true;
      lateUnsub?.();
      html.style.overflow = "";
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={veilRef}
      aria-hidden="true"
      className="veil fixed inset-0 z-[80] flex-col items-start justify-end bg-obsidian p-[clamp(1.25rem,4vw,3.5rem)]"
    >
      <div className="veil-count">
        <p className="label text-muted">Beyond the interface</p>
        <p className="display wdth-62 mt-2 text-[clamp(4rem,12vw,9rem)] leading-none text-silver">
          <span ref={countRef}>000</span>
        </p>
      </div>
    </div>
  );
}
