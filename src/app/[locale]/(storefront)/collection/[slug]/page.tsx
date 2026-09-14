import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/storefront/product-card";
import { getCollectionBySlug } from "@/lib/data/storefront";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return {};

  const name = locale === "ar" ? collection.name_ar : collection.name_en;
  return {
    title: name,
    alternates: { canonical: `/${locale}/collection/${slug}` },
  };
}

export default async function CollectionPage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await props.params;
  const t = await getTranslations("collectionsPage");
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const name = locale === "ar" ? collection.name_ar : collection.name_en;

  return (
    <Container className="py-(--spacing-section)">
      <h1 className="text-center font-display text-display-sm text-brand-900">{name}</h1>

      {collection.products.length === 0 ? (
        <p className="mt-16 text-center text-sm text-brand-500">{t("emptyCollection")}</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {collection.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </Container>
  );
}
