import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getInventoryProducts, type InventoryFilter } from "@/lib/data/admin/inventory";
import { StockAdjustRow } from "@/components/admin/stock-adjust-row";

export default async function AdminInventoryPage(props: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("adminInventory");
  const locale = await getLocale();

  const filter: InventoryFilter =
    searchParams.filter === "low" || searchParams.filter === "out" ? searchParams.filter : "all";

  const products = await getInventoryProducts({ filter, search: searchParams.q });

  const tabs: { key: InventoryFilter; label: string }[] = [
    { key: "all", label: t("all") },
    { key: "low", label: t("lowStock") },
    { key: "out", label: t("outOfStock") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const params = new URLSearchParams();
          if (tab.key !== "all") params.set("filter", tab.key);
          if (searchParams.q) params.set("q", searchParams.q);
          const href = `/${locale}/admin/inventory${params.toString() ? `?${params}` : ""}`;
          const active = filter === tab.key;
          return (
            <a
              key={tab.key}
              href={href}
              className={`rounded-(--radius-pill) px-4 py-1.5 text-xs font-medium uppercase tracking-wider ${
                active ? "bg-brand-900 text-paper" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>

      <form className="max-w-sm">
        {filter !== "all" && <input type="hidden" name="filter" value={filter} />}
        <input
          type="search"
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder={t("search")}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-2.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </form>

      <p className="text-sm text-brand-500">{t("resultCount", { count: products.length })}</p>

      {products.length === 0 ? (
        <p className="text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="px-5 py-3 text-start">{t("product")}</th>
                <th className="px-5 py-3 text-start">{t("category")}</th>
                <th className="px-5 py-3 text-start">{t("stock")}</th>
                <th className="px-5 py-3 text-start">{t("status")}</th>
                <th className="px-5 py-3 text-end">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {products.map((product) => {
                const isOut = product.stock_quantity === 0;
                const isLow = !isOut && product.stock_quantity <= product.low_stock_threshold;
                return (
                  <tr key={product.id}>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="font-medium text-brand-900 hover:underline"
                      >
                        {locale === "ar" ? product.name_ar : product.name_en}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-brand-700">
                      {product.category
                        ? locale === "ar"
                          ? product.category.name_ar
                          : product.category.name_en
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-brand-700">{product.stock_quantity}</td>
                    <td className="px-5 py-3">
                      {isOut ? (
                        <span className="rounded-(--radius-pill) bg-red-100 px-2.5 py-0.5 text-xs text-red-800">
                          {t("outOfStock")}
                        </span>
                      ) : isLow ? (
                        <span className="rounded-(--radius-pill) bg-amber-100 px-2.5 py-0.5 text-xs text-amber-800">
                          {t("lowStock")}
                        </span>
                      ) : (
                        <span className="rounded-(--radius-pill) bg-green-100 px-2.5 py-0.5 text-xs text-green-800">
                          {t("inStock")}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-end">
                      <StockAdjustRow
                        productId={product.id}
                        stockQuantity={product.stock_quantity}
                        lowStockThreshold={product.low_stock_threshold}
                      />
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
