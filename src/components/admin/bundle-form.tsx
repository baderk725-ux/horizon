"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { createBundleAction, updateBundleAction, type BundleActionState } from "@/lib/actions/bundles";
import { BundleProductPicker, type BundleLine } from "@/components/admin/bundle-product-picker";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AdminBundleDetail } from "@/lib/data/admin/bundles";

const initialState: BundleActionState = { error: null };

export function BundleForm({ bundle, onDone }: { bundle?: AdminBundleDetail; onDone?: () => void }) {
  const t = useTranslations("adminBundles");
  const tOrders = useTranslations("adminOrders");

  const [lines, setLines] = useState<BundleLine[]>(
    bundle?.products.map((p) => ({
      product: { id: p.productId, nameEn: p.nameEn, nameAr: p.nameAr, retailPrice: p.retailPrice, stockQuantity: 0 },
      quantity: p.quantity,
    })) ?? [],
  );

  const action = bundle ? updateBundleAction.bind(null, bundle.id) : createBundleAction;
  const [state, formAction, pending] = useActionState(
    async (prev: BundleActionState, formData: FormData) => {
      const result = await action(prev, formData);
      if (!result.error) onDone?.();
      return result;
    },
    initialState,
  );

  const sumOfComponents = lines.reduce((sum, l) => sum + l.product.retailPrice * l.quantity, 0);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="productsJson" value={JSON.stringify(lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })))} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("nameEn")} htmlFor="bundle-nameEn">
          <Input id="bundle-nameEn" name="nameEn" defaultValue={bundle?.name_en} required />
        </Field>
        <Field label={t("nameAr")} htmlFor="bundle-nameAr">
          <Input id="bundle-nameAr" name="nameAr" dir="rtl" defaultValue={bundle?.name_ar} required />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("descriptionEn")} htmlFor="bundle-descriptionEn">
          <Input id="bundle-descriptionEn" name="descriptionEn" defaultValue={bundle?.description_en ?? ""} />
        </Field>
        <Field label={t("descriptionAr")} htmlFor="bundle-descriptionAr">
          <Input id="bundle-descriptionAr" name="descriptionAr" dir="rtl" defaultValue={bundle?.description_ar ?? ""} />
        </Field>
      </div>

      <BundleProductPicker lines={lines} onChange={setLines} />
      {lines.length > 0 && (
        <p className="text-xs text-brand-500">
          {t("sumOfComponents")}: {sumOfComponents.toFixed(2)} {tOrders("currency")}
        </p>
      )}

      <Field label={t("bundlePrice")} htmlFor="bundle-bundlePrice">
        <Input
          id="bundle-bundlePrice"
          name="bundlePrice"
          type="number"
          step="0.01"
          min={0.01}
          defaultValue={bundle?.bundle_price}
          required
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-brand-700">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={bundle?.is_active ?? true}
          className="h-4 w-4 rounded border-brand-300 text-brand-900 focus:ring-accent-500"
        />
        {t("isActive")}
      </label>

      {state.error && <p className="text-sm text-danger">{t(state.error)}</p>}

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : bundle ? t("save") : t("create")}
      </Button>
    </form>
  );
}
