"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { searchProductsAction, type ProductSearchResult } from "@/lib/actions/product-search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CollectionProductPicker({
  products,
  onChange,
}: {
  products: ProductSearchResult[];
  onChange: (products: ProductSearchResult[]) => void;
}) {
  const t = useTranslations("adminCollections");
  const tOrders = useTranslations("adminOrders");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [, startTransition] = useTransition();

  function search(value: string) {
    setQuery(value);
    startTransition(async () => {
      setResults(await searchProductsAction(value));
    });
  }

  function addProduct(product: ProductSearchResult) {
    if (products.some((p) => p.id === product.id)) return;
    onChange([...products, product]);
    setQuery("");
    setResults([]);
  }

  function removeProduct(productId: string) {
    onChange(products.filter((p) => p.id !== productId));
  }

  return (
    <div>
      <label htmlFor="collection-product-search" className="block text-xs font-medium uppercase tracking-wider text-brand-700">
        {t("addProduct")}
      </label>
      <div className="relative mt-1.5">
        <Input
          id="collection-product-search"
          value={query}
          onChange={(e) => search(e.target.value)}
          placeholder={tOrders("productSearchPlaceholder")}
          autoComplete="off"
        />
        {results.length > 0 && query && (
          <ul className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto rounded-(--radius-card) border border-brand-200 bg-paper shadow-(--shadow-card-hover)">
            {results.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => addProduct(product)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-start text-sm hover:bg-brand-100"
                >
                  <span>{locale === "ar" ? product.nameAr : product.nameEn}</span>
                  <span className="text-xs text-brand-500">
                    {product.retailPrice.toFixed(2)} {tOrders("currency")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {products.length > 0 && (
        <ul className="mt-4 divide-y divide-brand-200 overflow-hidden rounded-(--radius-card) border border-brand-200">
          {products.map((product) => (
            <li key={product.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-brand-900">{locale === "ar" ? product.nameAr : product.nameEn}</span>
              <Button type="button" size="sm" variant="ghost" onClick={() => removeProduct(product.id)}>
                {t("remove")}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
