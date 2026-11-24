"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/** Scene 01 row 1.8 — hero copy slides up and fades as the Flow hands off to Scene 02. */
export function HeroScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-out]", {
        yPercent: -15,
        opacity: 0,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: { trigger: "#top", start: "top top", end: "70% top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);
  return null;
}
