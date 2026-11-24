"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis driven by GSAP's ticker (one clock). Native scroll on touch devices
 * and under reduced motion. Listens for k:scroll-lock (mobile menu).
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return;

    const lenis = new Lenis({ lerp: 0.1, autoRaf: false, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const onLock = (e: Event) => ((e as CustomEvent<boolean>).detail ? lenis.stop() : lenis.start());
    window.addEventListener("k:scroll-lock", onLock);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("k:scroll-lock", onLock);
      lenis.destroy();
    };
  }, []);
  return null;
}
