/** Motion tokens — docs/art-direction.md §7 (mirrored as CSS vars in globals.css). */
export const motion = {
  ease: {
    flow: "0.16, 1, 0.3, 1",
    cine: "0.65, 0, 0.35, 1",
  },
  dur: { micro: 0.2, ui: 0.45, reveal: 0.9, scene: 1.6 },
  stagger: { items: 0.06, lines: 0.08, chars: 0.018, letters: 0.05 },
} as const;
