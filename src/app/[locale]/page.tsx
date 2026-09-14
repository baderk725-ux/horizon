import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";
import {
  getHomeCollections,
  getPublishedProducts,
  getTopCategories,
} from "@/lib/data/storefront";

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const [categories, collections, products] = await Promise.all([
    getTopCategories(),
    getHomeCollections(),
    getPublishedProducts(8),
  ]);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-brand-600 text-paper">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/10 via-transparent to-brand-950/40" />
          <Container className="relative py-24 text-center">
            <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-brand-100">
              NOVEL Household
            </p>
            <h1 className="mt-6 font-display text-display-md text-paper sm:text-display-lg lg:text-display-xl">
              {t("heroTitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-balance font-sans text-base text-brand-100">
              {t("heroSubtitle")}
            </p>
            <ButtonLink href="/shop" variant="secondary" size="lg" className="mt-10 !border-paper !text-paper hover:!bg-paper hover:!text-brand-900">
              {t("shopNow")}
            </ButtonLink>
          </Container>
        </section>

        {/* Categories */}
        <section className="py-(--spacing-section)">
          <Container>
            <h2 className="text-center font-display text-display-sm text-brand-900">
              {t("shopByCategory")}
            </h2>
            {categories.length === 0 ? (
              <p className="mt-8 text-center text-sm text-brand-500">
                {t("emptyCategories")}
              </p>
            ) : (
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/${locale}/category/${category.slug}`}
                    className="group relative flex aspect-[4/5] items-end overflow-hidden rounded-(--radius-card) bg-brand-100 p-5"
                  >
                    <span className="font-display text-lg text-brand-900 transition-colors group-hover:text-accent-600">
                      {locale === "ar" ? category.name_ar : category.name_en}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* Collections */}
        {collections.length > 0 && (
          <section className="bg-paper-muted py-(--spacing-section)">
            <Container>
              <h2 className="text-center font-display text-display-sm text-brand-900">
                {t("collections")}
              </h2>
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {collections.map((collection) => (
                  <a
                    key={collection.id}
                    href={`/${locale}/collection/${collection.slug}`}
                    className={`group relative overflow-hidden rounded-(--radius-card) bg-brand-200 ${
                      collection.card_size === "large"
                        ? "sm:col-span-3 aspect-[16/7]"
                        : "aspect-[4/5]"
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-950/20 transition-colors group-hover:bg-brand-950/35">
                      <span className="font-display text-2xl text-paper">
                        {locale === "ar"
                          ? collection.name_ar
                          : collection.name_en}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Featured / new products */}
        <section className="py-(--spacing-section)">
          <Container>
            <h2 className="text-center font-display text-display-sm text-brand-900">
              {t("newArrivals")}
            </h2>
            {products.length === 0 ? (
              <p className="mt-8 text-center text-sm text-brand-500">
                {t("emptyProducts")}
              </p>
            ) : (
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
