import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { CategoryTile } from "@/components/home/CategoryTile";
import { EditorialSplit } from "@/components/home/EditorialSplit";
import { ProductRail } from "@/components/home/ProductRail";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductGrid } from "@/components/ProductGrid";
import { Newsletter } from "@/components/Newsletter";
import { ScrollReveal } from "@/components/ScrollReveal";
import { categories } from "@/lib/categories";
import { getBestSellers, getNewArrivals } from "@/lib/products";

export const metadata: Metadata = {
  title: "NOVEL — Beautiful Things for a Considered Home",
  description:
    "Shop NOVEL's curated collection of kitchen essentials, macramé, rugs, tableware and textiles — objects for a considered home.",
};

export default function HomePage() {
  const bestSellers = getBestSellers(8);
  const newArrivals = getNewArrivals(8);
  const featuredCategories = categories.filter((c) =>
    ["kitchen", "macrame", "rugs", "home-decor"].includes(c.slug)
  );

  return (
    <>
      <Hero />

      {/* Featured Collection */}
      <section className="container-editorial py-24 md:py-32">
        <ScrollReveal>
          <EditorialSplit
            eyebrow="Featured Collection"
            title="The Art of Home"
            description="Thoughtfully selected pieces designed to bring warmth, texture and character into everyday spaces."
            ctaLabel="Explore Collection"
            ctaHref="/shop/home-decor"
            icon="home-decor"
            tone="sand"
            imageAlt="A curated collection of ceramic and wood home objects"
          />
        </ScrollReveal>
      </section>

      {/* Categories */}
      <section id="collections" className="bg-cream py-24 md:py-32">
        <div className="container-editorial">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Shop by Category"
              title="Curated by Craft"
              description="From the kitchen to the living room, every category is built around material and making."
            />
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featuredCategories.map((category, i) => (
              <ScrollReveal key={category.slug} delay={i * 80}>
                <CategoryTile category={category} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container-editorial py-24 md:py-32">
        <ScrollReveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Best Sellers"
              title="The Pieces Everyone Returns For"
              description="A running list of the objects our customers reach for again and again."
            />
            <Link
              href="/shop/best-sellers"
              className="shrink-0 text-xs uppercase tracking-[0.14em] text-charcoal underline underline-offset-4 decoration-taupe hover:decoration-charcoal"
            >
              View All
            </Link>
          </div>
        </ScrollReveal>
        <div className="mt-12">
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      {/* Editorial Section */}
      <section className="bg-charcoal py-24 text-ivory md:py-32">
        <div className="container-editorial">
          <ScrollReveal>
            <EditorialSplit
              eyebrow="Journal"
              title="Details make the space."
              description="A single hand-thrown jug. A length of undyed linen. It's rarely the grand gesture that makes a room feel considered — it's the details you choose to notice."
              ctaLabel="Read the Journal"
              ctaHref="/journal/behind-the-pieces"
              icon="tableware"
              tone="charcoal"
              imageAlt="A close, textured detail of hand-glazed stoneware"
              reverse
            />
          </ScrollReveal>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container-editorial py-24 md:py-32">
        <ScrollReveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Just Landed"
              title="New Arrivals"
              description="The newest additions to the NOVEL collection, in from our makers this season."
            />
            <Link
              href="/shop/new-arrivals"
              className="shrink-0 text-xs uppercase tracking-[0.14em] text-charcoal underline underline-offset-4 decoration-taupe hover:decoration-charcoal"
            >
              View All
            </Link>
          </div>
        </ScrollReveal>
        <div className="mt-12">
          <ProductRail products={newArrivals} />
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-cream py-24 md:py-32">
        <div className="container-editorial">
          <ScrollReveal>
            <EditorialSplit
              eyebrow="Our Story"
              title="A brand built on material, not trend."
              description="NOVEL began with a simple frustration: that considered, well-made home goods were either impossible to find or priced for showrooms alone. We work directly with a small group of makers to bring their craft to your table, your shelf, your floor."
              ctaLabel="Discover Our Story"
              ctaHref="/about"
              icon="macrame"
              tone="taupe"
              imageAlt="A maker's hands hand-knotting macramé cord"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-editorial py-24 md:py-28">
        <ScrollReveal>
          <Newsletter />
        </ScrollReveal>
      </section>
    </>
  );
}
