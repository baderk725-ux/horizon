import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EditorialSplit } from "@/components/home/EditorialSplit";
import { EditorialImage } from "@/components/EditorialImage";
import { SectionHeading } from "@/components/SectionHeading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Newsletter } from "@/components/Newsletter";

export const metadata: Metadata = {
  title: "About",
  description: "The story of NOVEL — a premium home and lifestyle brand built on material and craft.",
};

const VALUES = [
  {
    title: "Material First",
    body: "We choose the material before the object — stoneware, olive wood, cast iron, cotton — and let it decide the form.",
  },
  {
    title: "Small-Batch Making",
    body: "Every collection is produced in limited runs with makers we work with directly, not through anonymous factories.",
  },
  {
    title: "Built to Age Well",
    body: "We design for the version of an object that's ten years old, not the day it ships — patina, not decay.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative flex h-[60vh] min-h-[420px] items-end bg-charcoal">
        <EditorialImage
          icon="textiles"
          tone="charcoal"
          alt="Natural linen textiles draped in soft light"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent" />
        <div className="container-editorial relative z-10 pb-16">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-tight text-ivory md:text-6xl">
            Beautiful things for a considered home.
          </h1>
        </div>
      </section>

      <section className="container-editorial py-24 md:py-32">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-stone">Our Story</span>
            <p className="mt-6 font-serif text-2xl leading-relaxed md:text-3xl">
              NOVEL began with a simple frustration: that considered, well-made home goods were
              either impossible to find or priced for showrooms alone.
            </p>
            <p className="mt-6 text-base leading-relaxed text-stone">
              We started by asking a small group of makers — potters, weavers, woodworkers — to make
              the objects we couldn&rsquo;t find anywhere else. What began as a handful of pieces has
              grown into a considered collection, but the process hasn&rsquo;t changed: every object
              is chosen for its material, its maker, and how it lives in a home over years, not
              seasons.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-cream py-24 md:py-32">
        <div className="container-editorial">
          <ScrollReveal>
            <EditorialSplit
              eyebrow="From the Workshop"
              title="Made by hand, made to last."
              description="Each collection begins on the wheel, the loom, or the workbench — not on a factory line. That means longer lead times, smaller runs, and pieces that carry the mark of the hands that made them."
              ctaLabel="Shop the Collection"
              ctaHref="/shop"
              icon="kitchen"
              tone="sand"
              imageAlt="A ceramicist's workshop with tools and stoneware"
            />
          </ScrollReveal>
        </div>
      </section>

      <section className="container-editorial py-24 md:py-32">
        <ScrollReveal>
          <SectionHeading eyebrow="What We Believe" title="Three Principles" align="center" />
        </ScrollReveal>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {VALUES.map((value, i) => (
            <ScrollReveal key={value.title} delay={i * 100}>
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="font-serif text-4xl text-taupe">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-serif text-xl">{value.title}</h3>
                <p className="text-sm leading-relaxed text-stone">{value.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-charcoal py-24 md:py-32">
        <div className="container-editorial">
          <ScrollReveal>
            <Newsletter tone="light" />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
