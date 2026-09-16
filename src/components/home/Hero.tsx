import Link from "next/link";
import { EditorialImage } from "@/components/EditorialImage";

export function Hero() {
  return (
    <section className="relative flex h-[92vh] min-h-[560px] w-full items-end overflow-hidden bg-charcoal">
      <EditorialImage
        icon="home-decor"
        tone="charcoal"
        alt="A warm, minimal living room styled with natural materials"
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent" />

      <div className="container-editorial relative z-10 flex w-full flex-col items-start gap-6 pb-20 md:pb-28">
        <span className="animate-fade-in text-xs uppercase tracking-[0.3em] text-ivory/80">
          Autumn Collection
        </span>
        <h1 className="animate-reveal max-w-2xl font-serif text-5xl leading-[1.05] text-ivory md:text-7xl">
          Objects for a considered home.
        </h1>
        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
          <Link
            href="/shop"
            className="bg-ivory px-8 py-4 text-xs uppercase tracking-[0.14em] text-charcoal transition-colors hover:bg-cream"
          >
            Shop Collection
          </Link>
          <Link
            href="/about"
            className="border border-ivory/60 px-8 py-4 text-xs uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-ivory/10"
          >
            Explore NOVEL
          </Link>
        </div>
      </div>
    </section>
  );
}
