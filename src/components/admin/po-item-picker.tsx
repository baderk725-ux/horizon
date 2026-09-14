"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  searchProductsForPurchaseOrderAction,
  type AdminProductSearchResult,
} from "@/lib/actions/product-search-admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type POLine = { product: AdminProductSearchResult; quantity: number; unitCost: number };

export function POItemPicker({ lines, onChange }: { lines: POLine[]; onChange: (lines: POLine[]) => void }) {
  const t = useTranslations("adminPurchaseOrders");
  const tOrders = useTranslations("adminOrders");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminProductSearchResult[]>([]);
  const [, startTransition] = useTransition();

  function search(value: string) {
    setQuery(value);
    startTransition(async () => {
      setResults(await searchProductsForPurchaseOrderAction(value));
    });
  }

  function addLine(product: AdminProductSearchResult) {
    if (lines.some((l) => l.product.id === product.id)) return;
    onChange([...lines, { product, quantity: 1, unitCost: product.cost }]);
    setQuery("");
    setResults([]);
  }

  function updateLine(productId: string, patch: Partial<Pick<POLine, "quantity" | "unitCost">>) {
    onChange(lines.map((l) => (l.product.id === productId ? { ...l, ...patch } : l)));
  }

  function removeLine(productId: string) {
    onChange(lines.filter((l) => l.product.id !== productId));
  }

  const total = lines.reduce((sum, l) => sum + l.unitCost * l.quantity, 0);

  return (
    <div>
      <label htmlFor="po-product-search" className="block text-xs font-medium uppercase tracking-wider text-brand-700">
        {t("addProduct")}
      </label>
      <div className="relative mt-1.5">
        <Input
          id="po-product-search"
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
                    {t("cost")}: {product.cost.toFixed(2)} {tOrders("currency")}
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
            <thead>
              <tr className="border-b border-brand-200 text-xs uppercase tracking-wider text-brand-500">
                <th className="px-4 py-2 text-start">{tOrders("product")}</th>
                <th className="px-4 py-2 text-start">{tOrders("quantity")}</th>
                <th className="px-4 py-2 text-start">{t("unitCost")}</th>
                <th className="px-4 py-2 text-start">{t("lineTotal")}</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {lines.map((line) => (
                <tr key={line.product.id}>
                  <td className="px-4 py-2.5 text-brand-900">
                    {locale === "ar" ? line.product.nameAr : line.product.nameEn}
                  </td>
                  <td className="w-20 px-4 py-2.5">
                    <input
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={(e) => updateLine(line.product.id, { quantity: Number(e.target.value) })}
                      className="w-full rounded-(--radius-button) border border-brand-300 px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="w-24 px-4 py-2.5">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={line.unitCost}
                      onChange={(e) => updateLine(line.product.id, { unitCost: Number(e.target.value) })}
                      className="w-full rounded-(--radius-button) border border-brand-300 px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-end text-brand-700">
                    {(line.unitCost * line.quantity).toFixed(2)} {tOrders("currency")}
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
          <div className="flex items-center justify-between border-t border-brand-200 bg-paper-muted px-4 py-2.5 text-sm">
            <span className="text-brand-600">{t("totalCost")}</span>
            <span className="font-medium text-brand-900">
              {total.toFixed(2)} {tOrders("currency")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
