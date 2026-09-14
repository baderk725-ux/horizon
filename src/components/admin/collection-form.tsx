"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { createCollectionAction, updateCollectionAction, type CollectionActionState } from "@/lib/actions/collections";
import { CollectionProductPicker } from "@/components/admin/collection-product-picker";
import type { ProductSearchResult } from "@/lib/actions/product-search";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AdminCollectionDetail } from "@/lib/data/admin/collections";

const initialState: CollectionActionState = { error: null };

export function CollectionForm({ collection, onDone }: { collection?: AdminCollectionDetail; onDone?: () => void }) {
  const t = useTranslations("adminCollections");

  const [products, setProducts] = useState<ProductSearchResult[]>(
    collection?.products.map((p) => ({ id: p.productId, nameEn: p.nameEn, nameAr: p.nameAr, retailPrice: 0, stockQuantity: 0 })) ?? [],
  );

  const action = collection ? updateCollectionAction.bind(null, collection.id) : createCollectionAction;
  const [state, formAction, pending] = useActionState(
    async (prev: CollectionActionState, formData: FormData) => {
      const result = await action(prev, formData);
      if (!result.error) onDone?.();
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="productIdsJson" value={JSON.stringify(products.map((p) => p.id))} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("nameEn")} htmlFor="collection-nameEn">
          <Input id="collection-nameEn" name="nameEn" defaultValue={collection?.name_en} required />
        </Field>
        <Field label={t("nameAr")} htmlFor="collection-nameAr">
          <Input id="collection-nameAr" name="nameAr" dir="rtl" defaultValue={collection?.name_ar} required />
        </Field>
      </div>

      <Field label={t("slug")} htmlFor="collection-slug">
        <Input id="collection-slug" name="slug" pattern="[a-z0-9-]+" defaultValue={collection?.slug} required />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={t("placement")} htmlFor="collection-placement">
          <select
            id="collection-placement"
            name="placement"
            defaultValue={collection?.placement ?? "home"}
            className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="home">{t("placementHome")}</option>
            <option value="shop_top">{t("placementShopTop")}</option>
            <option value="hidden">{t("placementHidden")}</option>
          </select>
        </Field>
        <Field label={t("cardSize")} htmlFor="collection-cardSize">
          <select
            id="collection-cardSize"
            name="cardSize"
            defaultValue={collection?.card_size ?? "normal"}
            className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="normal">{t("cardSizeNormal")}</option>
            <option value="large">{t("cardSizeLarge")}</option>
          </select>
        </Field>
        <Field label={t("sortOrder")} htmlFor="collection-sortOrder">
          <Input id="collection-sortOrder" name="sortOrder" type="number" min={0} defaultValue={collection?.sort_order ?? 0} />
        </Field>
      </div>

      <CollectionProductPicker products={products} onChange={setProducts} />

      <label className="flex items-center gap-2 text-sm text-brand-700">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={collection?.is_active ?? true}
          className="h-4 w-4 rounded border-brand-300 text-brand-900 focus:ring-accent-500"
        />
        {t("isActive")}
      </label>

      {state.error && <p className="text-sm text-danger">{t(state.error)}</p>}

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : collection ? t("save") : t("create")}
      </Button>
    </form>
  );
}
