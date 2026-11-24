"use client";

import { usePathname } from "next/navigation";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ChapterTracker } from "@/components/motion/ChapterTracker";
import { Intro } from "@/components/motion/Intro";
import { HeroScroll } from "@/components/motion/HeroScroll";
import { FlowCanvas } from "@/components/three/FlowCanvas";

/**
 * Motion + 3D enhancement layer. Everything here is additive: the server-rendered
 * DOM is complete, readable and navigable without it.
 */
export function Experience() {
  const pathname = usePathname();
  const home = pathname === "/";
  return (
    <>
      <SmoothScroll />
      {home && (
        <>
          <ChapterTracker />
          <FlowCanvas />
          <Intro />
          <HeroScroll />
        </>
      )}
    </>
  );
}
