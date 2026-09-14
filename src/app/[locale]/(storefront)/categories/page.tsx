import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getTopCategories } from "@/lib/data/storefront";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "categories" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/categories` },
  };
}

export default async function CategoriesPage() {
  const t = await getTranslations("categories");
  const locale = await getLocale();
  const categories = await getTopCategories();

  return (
    <Container className="py-(--spacing-section)">
      <h1 className="text-center font-display text-display-sm text-brand-900">{t("title")}</h1>

      {categories.length === 0 ? (
        <p className="mt-16 text-center text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={{ pathname: "/shop", query: { category: category.slug } }}
              className="group relative flex aspect-[4/5] items-end overflow-hidden rounded-(--radius-card) bg-brand-100 p-5"
            >
              <span className="font-display text-lg text-brand-900 transition-colors group-hover:text-accent-600">
                {locale === "ar" ? category.name_ar : category.name_en}
              </span>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
