"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { updateProductStockAction, type InventoryActionState } from "@/lib/actions/inventory";
import { Button } from "@/components/ui/button";

const initialState: InventoryActionState = { error: null };

export function StockAdjustRow({
  productId,
  stockQuantity,
  lowStockThreshold,
}: {
  productId: string;
  stockQuantity: number;
  lowStockThreshold: number;
}) {
  const t = useTranslations("adminInventory");
  const [editing, setEditing] = useState(false);
  const action = updateProductStockAction.bind(null, productId);
  const [state, formAction, pending] = useActionState(
    async (prev: InventoryActionState, formData: FormData) => {
      const result = await action(prev, formData);
      if (!result.error) setEditing(false);
      return result;
    },
    initialState,
  );

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-sm font-medium text-brand-700 hover:underline"
      >
        {t("adjust")}
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <div>
        <label htmlFor={`stock-${productId}`} className="block text-[10px] uppercase tracking-wider text-brand-500">
          {t("stockQuantity")}
        </label>
        <input
          id={`stock-${productId}`}
          name="stockQuantity"
          type="number"
          min={0}
          step={1}
          defaultValue={stockQuantity}
          required
          className="w-20 rounded-(--radius-button) border border-brand-300 bg-paper px-2 py-1 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </div>
      <div>
        <label htmlFor={`threshold-${productId}`} className="block text-[10px] uppercase tracking-wider text-brand-500">
          {t("lowStockThreshold")}
        </label>
        <input
          id={`threshold-${productId}`}
          name="lowStockThreshold"
          type="number"
          min={0}
          step={1}
          defaultValue={lowStockThreshold}
          required
          className="w-20 rounded-(--radius-button) border border-brand-300 bg-paper px-2 py-1 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </div>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : t("save")}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
        {t("cancel")}
      </Button>
      {state.error && <span className="w-full text-xs text-danger">{t(state.error)}</span>}
    </form>
  );
}
