"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { flow } from "@/lib/flow-store";
import { detectTier, downgrade, type Tier } from "./quality";

// The 3D chunk loads after first paint and never blocks LCP.
const FlowScene = dynamic(() => import("./FlowScene"), { ssr: false });

const isPortrait = () => window.innerWidth / window.innerHeight < 0.8;

export function FlowCanvas() {
  const [tier, setTier] = useState<Tier | null>(null);
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    setTier(detectTier());
    setPortrait(isPortrait());
    const onResize = () => setPortrait(isPortrait());
    window.addEventListener("resize", onResize);

    // Pointer → NDC; strength decays when idle. Fine pointers only.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      flow.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      flow.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      flow.pointer.last = performance.now();
    };
    let raf = 0;
    const decay = () => {
      const active = performance.now() - flow.pointer.last < 900 ? 1 : 0;
      flow.pointer.strength += (active - flow.pointer.strength) * 0.06;
      raf = requestAnimationFrame(decay);
    };
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(decay);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // A forced ?tier= (QA) pins the tier; otherwise slow devices step down automatically.
  const onSlow = useCallback(() => {
    if (new URLSearchParams(window.location.search).has("tier")) return;
    setTier((t) => (t ? downgrade(t) : t));
  }, []);

  if (!tier || tier === "none") return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" data-flow-tier={tier}>
      <FlowScene tier={tier} portrait={portrait} onSlow={onSlow} />
    </div>
  );
}
