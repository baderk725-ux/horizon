import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/storefront/product-card";
import { ShopFilters } from "@/components/storefront/shop-filters";
import { getShopProducts, type ShopSort } from "@/lib/data/shop";
import { getTopCategories } from "@/lib/data/storefront";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "shop" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/shop` },
  };
}

export default async function ShopPage(props: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("shop");
  const locale = await getLocale();

  const sort = (["newest", "price_asc", "price_desc"] as const).includes(
    searchParams.sort as ShopSort,
  )
    ? (searchParams.sort as ShopSort)
    : "newest";

  const [{ products, total, page, pageCount }, categories] = await Promise.all([
    getShopProducts({
      categorySlug: searchParams.category,
      search: searchParams.q,
      sort,
      page: searchParams.page ? Number(searchParams.page) : 1,
    }),
    getTopCategories(),
  ]);

  return (
    <Container className="py-(--spacing-section)">
      <h1 className="text-center font-display text-display-sm text-brand-900">{t("title")}</h1>

      <ShopFilters
        categories={categories}
        activeCategory={searchParams.category}
        activeSort={sort}
        activeQuery={searchParams.q}
      />

      <p className="mt-4 text-sm text-brand-500">{t("resultCount", { count: total })}</p>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-sm text-brand-500">{t("noResults")}</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-2" aria-label={t("pagination")}>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams();
            if (searchParams.category) params.set("category", searchParams.category);
            if (searchParams.q) params.set("q", searchParams.q);
            if (sort !== "newest") params.set("sort", sort);
            if (p > 1) params.set("page", String(p));
            const href = `/${locale}/shop${params.toString() ? `?${params}` : ""}`;
            return (
              <a
                key={p}
                href={href}
                aria-current={p === page ? "page" : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-(--radius-button) text-sm ${
                  p === page
                    ? "bg-brand-900 text-paper"
                    : "text-brand-700 hover:bg-brand-100"
                }`}
              >
                {p}
              </a>
            );
          })}
        </nav>
      )}
    </Container>
  );
}
