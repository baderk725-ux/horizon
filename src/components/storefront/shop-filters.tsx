"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { CategoryRow } from "@/lib/data/storefront";
import type { ShopSort } from "@/lib/data/shop";

export function ShopFilters({
  categories,
  activeCategory,
  activeSort,
  activeQuery,
}: {
  categories: CategoryRow[];
  activeCategory?: string;
  activeSort: ShopSort;
  activeQuery?: string;
}) {
  const t = useTranslations("shop");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateParam("category", null)}
          className={`rounded-(--radius-pill) px-4 py-1.5 text-xs font-medium uppercase tracking-wider ${
            !activeCategory ? "bg-brand-900 text-paper" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
          }`}
        >
          {t("allCategories")}
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => updateParam("category", c.slug)}
            className={`rounded-(--radius-pill) px-4 py-1.5 text-xs font-medium uppercase tracking-wider ${
              activeCategory === c.slug
                ? "bg-brand-900 text-paper"
                : "bg-brand-100 text-brand-700 hover:bg-brand-200"
            }`}
          >
            {locale === "ar" ? c.name_ar : c.name_en}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem("q") as HTMLInputElement;
            updateParam("q", input.value || null);
          }}
        >
          <input
            type="search"
            name="q"
            defaultValue={activeQuery ?? ""}
            placeholder={t("search")}
            className="rounded-(--radius-button) border border-brand-300 bg-paper px-3 py-2 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </form>

        <select
          value={activeSort}
          onChange={(e) => updateParam("sort", e.target.value === "newest" ? null : e.target.value)}
          className="rounded-(--radius-button) border border-brand-300 bg-paper px-3 py-2 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          <option value="newest">{t("sortNewest")}</option>
          <option value="price_asc">{t("sortPriceAsc")}</option>
          <option value="price_desc">{t("sortPriceDesc")}</option>
        </select>
      </div>
    </div>
  );
}
