import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAdminProducts } from "@/lib/data/admin/products";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { PublishToggleButton } from "@/components/admin/publish-toggle-button";

export default async function AdminProductsPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await props.searchParams;
  const t = await getTranslations("adminProducts");
  const locale = await getLocale();
  const products = await getAdminProducts(q);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <Link
          href="/admin/products/new"
          className="rounded-(--radius-button) bg-brand-900 px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-paper hover:bg-brand-800"
        >
          {t("newProduct")}
        </Link>
      </div>

      <form className="max-w-sm">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder={t("search")}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-2.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </form>

      {products.length === 0 ? (
        <p className="text-sm text-brand-500">{q ? t("noResults") : t("empty")}</p>
      ) : (
        <div className="overflow-hidden rounded-(--radius-card) border border-brand-200 bg-paper">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-brand-200">
              {products.map((product) => {
                const name = locale === "ar" ? product.name_ar : product.name_en;
                return (
                  <tr key={product.id}>
                    <td className="w-16 px-5 py-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-(--radius-card) bg-brand-100">
                        {product.thumbnail && (
                          <Image src={product.thumbnail} alt="" fill sizes="48px" className="object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-brand-900">{name}</p>
                      <p className="text-xs text-brand-500">
                        {product.retail_price.toFixed(2)} JOD ·{" "}
                        {product.category ? (locale === "ar" ? product.category.name_ar : product.category.name_en) : t("noCategory")}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <PublishToggleButton id={product.id} isPublished={product.is_published} />
                    </td>
                    <td className="px-5 py-3 text-end">
                      <div className="inline-flex items-center gap-4">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-sm font-medium text-brand-700 hover:underline"
                        >
                          {t("edit")}
                        </Link>
                        <DeleteProductButton id={product.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
