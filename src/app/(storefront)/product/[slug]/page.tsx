import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { DetailsAccordion } from "@/components/product/DetailsAccordion";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductGrid } from "@/components/ProductGrid";
import { getCategory } from "@/lib/categories";
import { getProduct, getRelatedProducts } from "@/lib/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const title = product.seoTitle || product.name;
  const description = product.seoDescription || product.shortDescription;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategory(product.category),
    getRelatedProducts(product),
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    category: category?.name,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(product.review
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.review.rating,
            reviewCount: product.review.count,
          },
        }
      : {}),
  };

  return (
    <div className="container-editorial py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: category?.name ?? product.category, href: `/shop/${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
        <ProductGallery images={product.images} />
        <ProductInfo product={product} />
      </div>

      <div className="mt-16 max-w-3xl">
        <h2 className="font-serif text-2xl">Description</h2>
        <p className="mt-4 text-base leading-relaxed text-stone">{product.description}</p>

        <div className="mt-8">
          <DetailsAccordion
            sections={[
              {
                title: "Materials",
                content: (
                  <ul className="list-disc space-y-1 pl-5">
                    {product.materials.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                ),
              },
              { title: "Dimensions", content: <p>{product.dimensions}</p> },
              {
                title: "Care Instructions",
                content: (
                  <ul className="list-disc space-y-1 pl-5">
                    {product.care.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                ),
              },
              { title: "Shipping & Returns", content: <p>{product.shipping} Returns accepted within 30 days.</p> },
            ]}
          />
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-24 border-t border-line pt-16">
          <SectionHeading eyebrow="Complete the Look" title="You May Also Like" />
          <div className="mt-10">
            <ProductGrid products={related} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
