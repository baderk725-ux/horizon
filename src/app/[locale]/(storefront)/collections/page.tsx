import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getActiveCollections } from "@/lib/data/storefront";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "collectionsPage" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/collections` },
  };
}

export default async function CollectionsPage() {
  const t = await getTranslations("collectionsPage");
  const locale = await getLocale();
  const collections = await getActiveCollections();

  return (
    <Container className="py-(--spacing-section)">
      <h1 className="text-center font-display text-display-sm text-brand-900">{t("title")}</h1>

      {collections.length === 0 ? (
        <p className="mt-16 text-center text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collection/${collection.slug}`}
              className="group relative overflow-hidden rounded-(--radius-card) bg-brand-200 aspect-[4/5]"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-brand-950/20 transition-colors group-hover:bg-brand-950/35">
                <span className="font-display text-2xl text-paper">
                  {locale === "ar" ? collection.name_ar : collection.name_en}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
