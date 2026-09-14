"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { searchProductsAction, type ProductSearchResult } from "@/lib/actions/product-search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type BundleLine = { product: ProductSearchResult; quantity: number };

export function BundleProductPicker({
  lines,
  onChange,
}: {
  lines: BundleLine[];
  onChange: (lines: BundleLine[]) => void;
}) {
  const t = useTranslations("adminBundles");
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

  function addLine(product: ProductSearchResult) {
    if (lines.some((l) => l.product.id === product.id)) return;
    onChange([...lines, { product, quantity: 1 }]);
    setQuery("");
    setResults([]);
  }

  function updateQuantity(productId: string, quantity: number) {
    onChange(lines.map((l) => (l.product.id === productId ? { ...l, quantity: Math.max(1, quantity) } : l)));
  }

  function removeLine(productId: string) {
    onChange(lines.filter((l) => l.product.id !== productId));
  }

  return (
    <div>
      <label htmlFor="bundle-product-search" className="block text-xs font-medium uppercase tracking-wider text-brand-700">
        {t("addProductToBundle")}
      </label>
      <div className="relative mt-1.5">
        <Input
          id="bundle-product-search"
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
                  onClick={() => addLine(product)}
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

      {lines.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-(--radius-card) border border-brand-200">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-brand-200">
              {lines.map((line) => (
                <tr key={line.product.id}>
                  <td className="px-4 py-2.5 text-brand-900">
                    {locale === "ar" ? line.product.nameAr : line.product.nameEn}
                  </td>
                  <td className="w-24 px-4 py-2.5">
                    <input
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={(e) => updateQuantity(line.product.id, Number(e.target.value))}
                      className="w-full rounded-(--radius-button) border border-brand-300 px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-end text-brand-700">
                    {(line.product.retailPrice * line.quantity).toFixed(2)} {tOrders("currency")}
                  </td>
                  <td className="px-4 py-2.5 text-end">
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeLine(line.product.id)}>
                      {t("remove")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
