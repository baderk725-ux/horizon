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
import { getCategories } from "@/lib/categories";
import { getBestSellers, getNewArrivals } from "@/lib/products";
import { getHomepageContent } from "@/lib/homepage";

export const metadata: Metadata = {
  title: "NOVEL — Beautiful Things for a Considered Home",
  description:
    "Shop NOVEL's curated collection of kitchen essentials, macramé, rugs, tableware and textiles — objects for a considered home.",
};

export default async function HomePage() {
  const [bestSellers, newArrivals, categories, content] = await Promise.all([
    getBestSellers(8),
    getNewArrivals(8),
    getCategories(),
    getHomepageContent(),
  ]);

  const featuredCategories = categories
    .filter((c) => ["kitchen", "macrame", "rugs", "home-decor"].includes(c.slug))
    .slice(0, 4);

  return (
    <>
      <Hero content={content.hero} />

      {/* Featured Collection */}
      <section className="container-editorial py-24 md:py-32">
        <ScrollReveal>
          <EditorialSplit
            eyebrow={content.featured_collection.eyebrow}
            title={content.featured_collection.heading}
            description={content.featured_collection.description}
            ctaLabel={content.featured_collection.ctaLabel}
            ctaHref={content.featured_collection.ctaHref}
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
              eyebrow={content.editorial.eyebrow}
              title={content.editorial.heading}
              description={content.editorial.description}
              ctaLabel={content.editorial.ctaLabel}
              ctaHref={content.editorial.ctaHref}
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
              eyebrow={content.brand_story.eyebrow}
              title={content.brand_story.heading}
              description={content.brand_story.description}
              ctaLabel={content.brand_story.ctaLabel}
              ctaHref={content.brand_story.ctaHref}
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
