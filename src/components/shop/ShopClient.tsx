"use client";

import { useMemo, useState } from "react";
import type { Category, CategorySlug, Product } from "@/lib/types";
import { ProductGrid } from "@/components/ProductGrid";

type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "name-asc": "Name: A to Z",
};

export function ShopClient({
  products,
  categories,
  lockedCategory,
}: {
  products: Product[];
  categories: Category[];
  lockedCategory?: CategorySlug;
}) {
  const [activeCategories, setActiveCategories] = useState<CategorySlug[]>(
    lockedCategory ? [lockedCategory] : []
  );
  const [maxPrice, setMaxPrice] = useState(400);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const priceCeiling = 400;

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.price <= maxPrice);
    if (activeCategories.length > 0) {
      result = result.filter((p) => activeCategories.includes(p.category));
    }
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return result;
  }, [products, activeCategories, maxPrice, inStockOnly, sort]);

  function toggleCategory(slug: CategorySlug) {
    if (lockedCategory) return;
    setActiveCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  }

  return (
    <div className="flex flex-col gap-8 md:flex-row md:gap-12">
      <button
        type="button"
        onClick={() => setFiltersOpen((v) => !v)}
        className="flex items-center justify-between border border-line px-4 py-3 text-xs uppercase tracking-[0.14em] md:hidden"
      >
        Filters &amp; Sort
        <span aria-hidden="true">{filtersOpen ? "−" : "+"}</span>
      </button>

      <aside className={`w-full shrink-0 md:block md:w-56 ${filtersOpen ? "block" : "hidden"}`}>
        <div className="flex flex-col gap-10">
          {!lockedCategory ? (
            <div>
              <h3 className="text-xs uppercase tracking-[0.14em] text-stone">Category</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <label className="flex items-center gap-3 text-sm text-charcoal">
                      <input
                        type="checkbox"
                        checked={activeCategories.includes(c.slug)}
                        onChange={() => toggleCategory(c.slug)}
                        className="h-4 w-4 accent-charcoal"
                      />
                      {c.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <h3 className="text-xs uppercase tracking-[0.14em] text-stone">Price</h3>
            <div className="mt-4 flex flex-col gap-2">
              <input
                type="range"
                min={20}
                max={priceCeiling}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-charcoal"
                aria-label="Maximum price"
              />
              <span className="text-sm text-stone">Up to ${maxPrice}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.14em] text-stone">Availability</h3>
            <label className="mt-4 flex items-center gap-3 text-sm text-charcoal">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 accent-charcoal"
              />
              In stock only
            </label>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="mb-8 flex items-center justify-between border-b border-line pb-4">
          <span className="text-sm text-stone">{filtered.length} products</span>
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <span className="hidden text-xs uppercase tracking-[0.1em] text-stone sm:inline">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="border border-line bg-ivory px-3 py-2 text-sm focus:outline-none"
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
