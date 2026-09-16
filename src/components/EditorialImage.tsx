import type { PlaceholderIcon, PlaceholderTone } from "@/lib/types";

const TONE_STYLES: Record<PlaceholderTone, { from: string; to: string; ink: string }> = {
  ivory: { from: "#f3ecdf", to: "#e6dac8", ink: "#8a7c6a" },
  sand: { from: "#e6dac8", to: "#d8c6a8", ink: "#6b5c48" },
  taupe: { from: "#c9b79c", to: "#a9906f", ink: "#3a3128" },
  charcoal: { from: "#3a3530", to: "#211d19", ink: "#c9b79c" },
};

const ICON_PATHS: Record<PlaceholderIcon, string> = {
  kitchen:
    "M32 10c0 6-4 8-4 14v46M28 10c0 6 4 8 4 14M36 10c0 6-4 8-4 14M68 14c8 2 12 10 12 18 0 9-6 16-12 16v42M68 14v34",
  macrame:
    "M50 8v14M30 22c0 10 10 12 20 12s20-2 20-12M30 22c0 12 8 16 12 22M70 22c0 12-8 16-12 22M42 44c0 10 4 14 8 20M58 44c0 10-4 14-8 20M50 64v28",
  rugs:
    "M14 20h72v60H14zM14 34h72M14 48h72M14 62h72M28 20v60M50 20v60M72 20v60",
  "home-decor":
    "M50 12c-10 8-16 18-16 30 0 12 8 20 16 20s16-8 16-20c0-12-6-22-16-30zM34 74h32M40 74v14h20V74",
  tableware:
    "M22 12v30c0 8 4 12 10 12s10-4 10-12V12M32 54v34M22 12v10M42 12v10M70 12c-8 0-12 8-12 18s4 18 12 18M70 12v76",
  textiles:
    "M14 26h72M14 26c6 6 6 12 0 18s-6 12 0 18M86 26c-6 6-6 12 0 18s-6 12 0 18M14 62h72M28 26v36M50 26v36M72 26v36",
  gifts:
    "M18 40h64v42H18zM18 40l6-14h52l6 14M50 26V8M38 8c-6 0-12 4-12 10s6 8 12 8 12-2 12-8M62 8c6 0 12 4 12 10s-6 8-12 8-12-2-12-8M50 40v42",
};

interface EditorialImageProps {
  icon: PlaceholderIcon;
  tone: PlaceholderTone;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function EditorialImage({ icon, tone, alt, className = "" }: EditorialImageProps) {
  const palette = TONE_STYLES[tone];
  const gradientId = `grad-${icon}-${tone}`;

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(155deg, ${palette.from}, ${palette.to})` }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.from} />
            <stop offset="100%" stopColor={palette.to} />
          </linearGradient>
          <filter id={`grain-${icon}-${tone}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.03 0" />
          </filter>
        </defs>
        <rect width="100" height="100" fill={`url(#${gradientId})`} />
        <rect width="100" height="100" filter={`url(#grain-${icon}-${tone})`} />
        <g transform="translate(20,15) scale(0.6)" fill="none" stroke={palette.ink} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
          <path d={ICON_PATHS[icon]} />
        </g>
      </svg>
    </div>
  );
}
