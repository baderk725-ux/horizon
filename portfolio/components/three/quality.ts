/**
 * Quality tiers (docs/preproduction/technical-plan.md §5).
 *  high   desktop, ≥ 6 cores          30k particles + bloom
 *  medium desktop, ≤ 4–5 cores        18k particles + bloom
 *  low    mobile / coarse / save-data  9k particles, no postprocessing (brighter core instead)
 *  static prefers-reduced-motion       9k particles, rendered on demand, no animation
 *  none   no WebGL2                    DOM only
 */
export type Tier = "high" | "medium" | "low" | "static" | "none";

export const tierConfig = {
  high: { count: 30000, bloom: true, dpr: [1, 1.75] as [number, number] },
  medium: { count: 18000, bloom: true, dpr: [1, 1.5] as [number, number] },
  low: { count: 9000, bloom: false, dpr: [1, 1.5] as [number, number] },
  static: { count: 9000, bloom: false, dpr: [1, 1.5] as [number, number] },
} as const;

export function detectTier(): Tier {
  if (typeof window === "undefined") return "none";
  if (!("WebGL2RenderingContext" in window)) return "none";
  const q = new URLSearchParams(window.location.search).get("tier");
  if (q === "high" || q === "medium" || q === "low" || q === "static") return q; // QA override
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return "low";
  if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768) return "low";
  const cores = nav.hardwareConcurrency ?? 4;
  if (cores <= 4 || (nav.deviceMemory ?? 8) <= 4) return "medium";
  return "high";
}

export const downgrade = (t: Tier): Tier => (t === "high" ? "medium" : t === "medium" ? "low" : t);
