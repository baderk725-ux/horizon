interface SectionLabelProps {
  index: string;
  children: string;
  className?: string;
}

/** Mono chapter label: "● 03 — Capabilities" */
export function SectionLabel({ index, children, className = "" }: SectionLabelProps) {
  return (
    <p className={`label flex items-center gap-3 text-muted ${className}`}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-lime" />
      <span>
        {index} — {children}
      </span>
    </p>
  );
}
