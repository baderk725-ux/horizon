import Link from "next/link";

/**
 * Wordmark placeholder standing in for the supplied brand mark.
 * Swap the inner markup for the official NOVEL logo asset when available —
 * keep the same footprint (aria-label, href) so header/footer layout is unaffected.
 */
export function Logo({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const color = tone === "light" ? "text-ivory" : "text-charcoal";
  return (
    <Link
      href="/"
      aria-label="NOVEL — home"
      className={`font-serif text-2xl tracking-[0.18em] ${color} ${className}`}
    >
      NOVEL
    </Link>
  );
}
