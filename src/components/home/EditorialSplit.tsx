import Link from "next/link";
import type { PlaceholderIcon, PlaceholderTone } from "@/lib/types";
import { EditorialImage } from "@/components/EditorialImage";

interface EditorialSplitProps {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  icon: PlaceholderIcon;
  tone: PlaceholderTone;
  imageAlt: string;
  reverse?: boolean;
}

export function EditorialSplit({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  icon,
  tone,
  imageAlt,
  reverse = false,
}: EditorialSplitProps) {
  return (
    <div className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${reverse ? "" : ""}`}>
      <div className={`aspect-[4/5] overflow-hidden ${reverse ? "md:order-2" : ""}`}>
        <EditorialImage icon={icon} tone={tone} alt={imageAlt} className="h-full w-full" />
      </div>
      <div className={`flex flex-col items-start gap-6 ${reverse ? "md:order-1" : ""}`}>
        <span className="text-xs uppercase tracking-[0.2em] text-stone">{eyebrow}</span>
        <h2 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h2>
        <p className="max-w-md text-base leading-relaxed text-stone">{description}</p>
        <Link
          href={ctaHref}
          className="text-xs uppercase tracking-[0.14em] text-charcoal underline underline-offset-4 decoration-taupe transition-colors hover:decoration-charcoal"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
