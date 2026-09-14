import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { getProductBySlug } from "@/lib/data/shop";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const name = locale === "ar" ? product.name_ar : product.name_en;
  const description =
    (locale === "ar" ? product.description_ar : product.description_en) ?? name;
  const image = product.images[0]?.url;

  return {
    title: name,
    description,
    alternates: { canonical: `/${locale}/product/${slug}` },
    openGraph: {
      title: name,
      description,
      images: image ? [{ url: image }] : undefined,
      type: "website",
    },
  };
}

export default async function ProductPage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations("product");
  const name = locale === "ar" ? product.name_ar : product.name_en;
  const description = locale === "ar" ? product.description_ar : product.description_en;
  const packageContents =
    locale === "ar" ? product.package_contents_ar : product.package_contents_en;
  const outOfStock = product.stock_quantity <= 0;
  const onSale = product.original_price !== null && product.original_price > product.retail_price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name_en,
    description: product.description_en ?? undefined,
    image: product.images.map((i) => i.url),
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "JOD",
      price: product.retail_price.toFixed(2),
      availability: outOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
    ...(product.reviewCount > 0 && product.averageRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.averageRating.toFixed(1),
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  return (
    <Container className="py-(--spacing-section)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="breadcrumb" className="text-xs text-brand-500">
        <a href={`/${locale}/shop`} className="hover:text-brand-900">
          {locale === "ar" ? "المتجر" : "Shop"}
        </a>
        {product.category && (
          <>
            {" / "}
            <a href={`/${locale}/shop?category=${product.category.slug}`} className="hover:text-brand-900">
              {locale === "ar" ? product.category.name_ar : product.category.name_en}
            </a>
          </>
        )}
        {" / "}
        <span className="text-brand-700">{name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} alt={name} />

        <div>
          <h1 className="font-display text-display-sm text-brand-900">{name}</h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-xl font-medium text-brand-900">
              {product.retail_price.toFixed(2)} {t("currency")}
            </span>
            {onSale && (
              <span className="text-base text-brand-400 line-through">
                {product.original_price!.toFixed(2)} {t("currency")}
              </span>
            )}
          </div>

          {product.reviewCount > 0 && (
            <p className="mt-2 text-sm text-brand-600">
              {"★".repeat(Math.round(product.averageRating ?? 0))}
              {"☆".repeat(5 - Math.round(product.averageRating ?? 0))}{" "}
              <span className="text-brand-500">({product.reviewCount})</span>
            </p>
          )}

          {description && (
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-brand-700">
              {description}
            </p>
          )}

          <dl className="mt-6 space-y-1 text-sm text-brand-600">
            {product.material && (
              <div className="flex gap-2">
                <dt className="font-medium text-brand-800">{t("material")}</dt>
                <dd>{product.material}</dd>
              </div>
            )}
            {product.color && (
              <div className="flex gap-2">
                <dt className="font-medium text-brand-800">{t("color")}</dt>
                <dd>{product.color}</dd>
              </div>
            )}
            {product.dimensions && (
              <div className="flex gap-2">
                <dt className="font-medium text-brand-800">{t("dimensions")}</dt>
                <dd>{product.dimensions}</dd>
              </div>
            )}
            {packageContents && (
              <div className="flex gap-2">
                <dt className="font-medium text-brand-800">{t("packageContents")}</dt>
                <dd>{packageContents}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8">
            <AddToCartButton productId={product.id} disabled={outOfStock} />
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <section className="mt-16 max-w-2xl">
          <h2 className="font-display text-lg text-brand-900">{t("reviews")}</h2>
          <ul className="mt-4 space-y-4">
            {product.reviews.map((review, i) => (
              <li key={i} className="border-b border-brand-200 pb-4">
                <p className="text-sm text-brand-600">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </p>
                {review.comment && (
                  <p className="mt-1 text-sm text-brand-700">{review.comment}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {product.related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-lg text-brand-900">{t("relatedProducts")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {product.related.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
