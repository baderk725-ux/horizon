interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";
  const color = tone === "light" ? "text-ivory" : "text-charcoal";
  const subColor = tone === "light" ? "text-ivory/70" : "text-stone";

  return (
    <div className={`flex flex-col gap-4 max-w-xl ${alignClass}`}>
      {eyebrow ? (
        <span className={`text-xs uppercase tracking-[0.2em] ${subColor}`}>{eyebrow}</span>
      ) : null}
      <h2 className={`font-serif text-3xl md:text-4xl leading-tight ${color}`}>{title}</h2>
      {description ? <p className={`text-base leading-relaxed ${subColor}`}>{description}</p> : null}
    </div>
  );
}
