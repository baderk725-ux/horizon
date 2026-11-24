"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import { flow } from "@/lib/flow-store";

/**
 * Writes chapter progress (0…5, fractional) from the sections' scroll position.
 * Pure function of scroll → reversible, reload-safe, scrollbar-drag-safe.
 */
export function ChapterTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    const triggers = sections.map((el) => {
      const idx = Number(el.dataset.chapter);
      return ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          if (self.isActive) flow.progress = idx + self.progress;
        },
        onLeave: () => (flow.progress = Math.min(5, idx + 1)),
        onEnterBack: (self) => (flow.progress = idx + self.progress),
      });
    });
    // Hero exit (0 → 1 across the first 60% of the hero's scroll)
    const hero = sections.find((s) => s.dataset.chapter === "0");
    const heroT = hero
      ? ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "60% top",
          onUpdate: (self) => (flow.heroExit = self.progress),
        })
      : null;
    // Initialise for reloads at depth
    ScrollTrigger.refresh();
    const active = triggers.find((t) => t.isActive);
    if (active) flow.progress = Number((active.trigger as HTMLElement).dataset.chapter) + active.progress;
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      triggers.forEach((t) => t.kill());
      heroT?.kill();
    };
  }, [pathname]);
  return null;
}
