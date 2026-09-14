/**
 * Deterministic color-ramp generation for the Theme Editor.
 *
 * An admin picks exactly two colors (primary, accent). Rather than let them
 * set 14 individual shades — which would make it trivial to ship an
 * inaccessible combination — this derives the full brand-50..950 and
 * accent-400/500/600 scale from each picked color's hue+saturation only,
 * using the SAME lightness steps as the original hand-tuned palette in
 * globals.css. Fixing lightness this way keeps text/background contrast
 * behavior identical to the palette that was designed (and already used
 * throughout the site) regardless of which hue is chosen.
 */

export type HslColor = { h: number; s: number; l: number };

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToHsl(hex: string): HslColor {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    default:
      h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToHex(h: number, s: number, l: number): string {
  const hh = ((h % 360) + 360) / 360;
  const ss = s / 100;
  const ll = l / 100;

  if (ss === 0) {
    const v = ll * 255;
    return rgbToHex(v, v, v);
  }

  const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
  const p = 2 * ll - q;
  const hueToRgb = (t0: number) => {
    let t = t0;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const r = hueToRgb(hh + 1 / 3) * 255;
  const g = hueToRgb(hh) * 255;
  const b = hueToRgb(hh - 1 / 3) * 255;
  return rgbToHex(r, g, b);
}

/** Lightness steps sampled from the original hand-tuned brand-50..950 ramp. */
const BRAND_LIGHTNESS: Record<string, number> = {
  "50": 97,
  "100": 92,
  "200": 84,
  "300": 73,
  "400": 61,
  "500": 51,
  "600": 46,
  "700": 37,
  "800": 29,
  "900": 20,
  "950": 12,
};

const ACCENT_LIGHTNESS: Record<string, number> = {
  "400": 62,
  "500": 52,
  "600": 41,
};

export function buildBrandScale(baseHex: string): Record<string, string> {
  const { h, s } = hexToHsl(baseHex);
  const scale: Record<string, string> = {};
  for (const [step, l] of Object.entries(BRAND_LIGHTNESS)) {
    scale[step] = hslToHex(h, s, l);
  }
  return scale;
}

export function buildAccentScale(baseHex: string): Record<string, string> {
  const { h, s } = hexToHsl(baseHex);
  const scale: Record<string, string> = {};
  for (const [step, l] of Object.entries(ACCENT_LIGHTNESS)) {
    scale[step] = hslToHex(h, s, l);
  }
  return scale;
}

function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/** WCAG 2.1 contrast ratio between two colors, 1 (none) to 21 (max). */
export function contrastRatio(hexA: string, hexB: string): number {
  const lA = relativeLuminance(hexA) + 0.05;
  const lB = relativeLuminance(hexB) + 0.05;
  return lA > lB ? lA / lB : lB / lA;
}

export const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
