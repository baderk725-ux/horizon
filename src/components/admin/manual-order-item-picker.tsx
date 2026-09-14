"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { searchProductsAction, type ProductSearchResult } from "@/lib/actions/product-search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type OrderLine = { product: ProductSearchResult; quantity: number };

export function ManualOrderItemPicker({
  lines,
  onChange,
}: {
  lines: OrderLine[];
  onChange: (lines: OrderLine[]) => void;
}) {
  const t = useTranslations("adminOrders");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [pending, startTransition] = useTransition();

  function search(value: string) {
    setQuery(value);
    startTransition(async () => {
      setResults(await searchProductsAction(value));
    });
  }

  function addLine(product: ProductSearchResult) {
    const existing = lines.find((l) => l.product.id === product.id);
    if (existing) {
      onChange(
        lines.map((l) =>
          l.product.id === product.id
            ? { ...l, quantity: Math.min(l.quantity + 1, product.stockQuantity) }
            : l,
        ),
      );
    } else {
      onChange([...lines, { product, quantity: 1 }]);
    }
    setQuery("");
    setResults([]);
  }

  function updateQuantity(productId: string, quantity: number) {
    onChange(
      lines.map((l) => (l.product.id === productId ? { ...l, quantity: Math.max(1, quantity) } : l)),
    );
  }

  function removeLine(productId: string) {
    onChange(lines.filter((l) => l.product.id !== productId));
  }

  const estimatedSubtotal = lines.reduce((sum, l) => sum + l.product.retailPrice * l.quantity, 0);

  return (
    <div>
      <label htmlFor="product-search" className="block text-xs font-medium uppercase tracking-wider text-brand-700">
        {t("addProduct")}
      </label>
      <div className="relative mt-1.5">
        <Input
          id="product-search"
          value={query}
          onChange={(e) => search(e.target.value)}
          placeholder={t("productSearchPlaceholder")}
          autoComplete="off"
        />
        {(results.length > 0 || pending) && query && (
          <ul className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto rounded-(--radius-card) border border-brand-200 bg-paper shadow-(--shadow-card-hover)">
            {results.map((product) => {
              const name = locale === "ar" ? product.nameAr : product.nameEn;
              const outOfStock = product.stockQuantity <= 0;
              return (
                <li key={product.id}>
                  <button
                    type="button"
                    disabled={outOfStock}
                    onClick={() => addLine(product)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-start text-sm hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>{name}</span>
                    <span className="text-xs text-brand-500">
                      {product.retailPrice.toFixed(2)} {t("currency")} ·{" "}
                      {outOfStock ? t("outOfStock") : `${product.stockQuantity} ${t("inStock")}`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {lines.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-(--radius-card) border border-brand-200">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-brand-200">
              {lines.map((line) => {
                const name = locale === "ar" ? line.product.nameAr : line.product.nameEn;
                return (
                  <tr key={line.product.id}>
                    <td className="px-4 py-2.5 text-brand-900">{name}</td>
                    <td className="w-24 px-4 py-2.5">
                      <input
                        type="number"
                        min={1}
                        max={line.product.stockQuantity}
                        value={line.quantity}
                        onChange={(e) => updateQuantity(line.product.id, Number(e.target.value))}
                        className="w-full rounded-(--radius-button) border border-brand-300 px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2.5 text-end text-brand-700">
                      {(line.product.retailPrice * line.quantity).toFixed(2)} {t("currency")}
                    </td>
                    <td className="px-4 py-2.5 text-end">
                      <Button type="button" size="sm" variant="ghost" onClick={() => removeLine(line.product.id)}>
                        {t("delete")}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-brand-200 bg-paper-muted px-4 py-2.5 text-sm">
            <span className="text-brand-600">{t("estimatedSubtotal")}</span>
            <span className="font-medium text-brand-900">
              {estimatedSubtotal.toFixed(2)} {t("currency")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
