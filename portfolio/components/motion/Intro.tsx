"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { flow, onFlowReady } from "@/lib/flow-store";
import { motion } from "@/lib/motion-tokens";
import { wordmarkState } from "@/components/three/Wordmark3D";
import { detectTier } from "@/components/three/quality";

/**
 * SCENE 01 — the opening (docs/preproduction/storyboard-motion-spec.md, rows 1.1–1.8).
 * First visit: veil + counter (≤ 2.0s) → gathering → letter rise → lines → nav.
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

    if (!firstVisit) {
      // Repeat visit: gather + seamless crossfade, no hidden content.
      const unsub = onFlowReady(() => ctx.add(() => gsap.to(flow, { intro: 1, duration: 1.8, ease: "power2.inOut" })));
      waitForWordmark(4000).then((ok) => {
        if (!ok) return;
        flow.letters = flow.letters.map(() => 1);
        takeOver(true, 0.3);
      });
      return () => {
        unsub();
        ctx.revert();
      };
    }

    // ---------- First visit
    window.dispatchEvent(new CustomEvent("k:scroll-lock", { detail: true }));
    html.style.overflow = "hidden";
    const counter = { v: 0 };
    ctx.add(() => {
      // The LCP candidate (offer line) is never hidden — only moved — so LCP isn't delayed by the intro.
      gsap.set(lines, { y: 24 });
      const lcpSafe = window.innerWidth < 768; // on mobile the offer line is the LCP element; on desktop it's the wordmark
      gsap.set(lines.filter((l) => !(lcpSafe && l.hasAttribute("data-lcp"))), { opacity: 0 });
      if (header) gsap.set(header, { opacity: 0 });
      gsap.to(counter, {
        v: 90,
        duration: 1.4,
        ease: "power1.out",
        onUpdate: () => countRef.current && (countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0")),
      });
    });

    let cancelled = false;
    waitForWordmark(2000).then((ok) => {
      if (cancelled) return;
      ctx.add(() => {
        const tl = gsap.timeline();
        tl.to(counter, {
          v: 100,
          duration: 0.3,
          ease: "power1.out",
          onUpdate: () => countRef.current && (countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0")),
        });
        // Hand the wordmark to WebGL (letters still below their masks) under the veil
        tl.add(() => {
          if (ok) {
            flow.wordmark = 1;
            if (h1) gsap.set(h1, { opacity: 0 });
          }
        });
        tl.to(veilRef.current, { autoAlpha: 0, duration: 0.6, ease: "cine" }, ">");
        tl.add(() => {
          html.style.overflow = "";
          window.dispatchEvent(new CustomEvent("k:scroll-lock", { detail: false }));
        });
        const t0 = tl.duration() - 0.35; // overlap the veil's exit
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
      <p className="label text-muted">Beyond the interface</p>
      <p className="display wdth-62 mt-2 text-[clamp(4rem,12vw,9rem)] leading-none text-silver">
        <span ref={countRef}>000</span>
      </p>
    </div>
  );
}
