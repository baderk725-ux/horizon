interface MonogramProps {
  size?: number;
  className?: string;
  /** Colour of the rigid strokes; the flow arm is always lime unless `mono` */
  ink?: string;
  mono?: boolean;
}

/** Monogram K — rigid stem + upper arm (structure), lower arm drawn as the Flow. */
export function Monogram({ size = 26, className, ink = "currentColor", mono = false }: MonogramProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" className={className} aria-hidden="true" focusable="false">
      <rect x="3" y="2" width="4.2" height="22" fill={ink} />
      <path d="M8 14 L19 2 H24 L12 14Z" fill={ink} />
      <path
        d="M10.5 13.2 C15 13.2 17 16 18.5 19.5 S21.5 24 24 24"
        stroke={mono ? ink : "var(--color-lime)"}
        strokeWidth="3.2"
        fill="none"
      />
    </svg>
  );
}
