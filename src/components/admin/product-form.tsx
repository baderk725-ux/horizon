"use client";

import { useActionState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  createProductAction,
  updateProductAction,
  type ProductActionState,
} from "@/lib/actions/products";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AdminProductRow } from "@/lib/data/admin/products";
import type { CategoryRow } from "@/lib/data/admin/categories";

const initialState: ProductActionState = { error: null };

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 font-sans text-sm text-brand-900 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
    />
  );
}

export function ProductForm({
  product,
  categories,
}: {
  product?: AdminProductRow;
  categories: CategoryRow[];
}) {
  const t = useTranslations("adminProducts");
  const locale = useLocale();

  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;

  const [state, formAction, pending] = useActionState(action, initialState);
  const fieldError = (name: string) =>
    state.fieldErrors?.[name] === "slug_format"
      ? t("slug_format")
      : state.fieldErrors?.[name] === "original_price_too_low"
        ? t("original_price_too_low")
        : undefined;

  return (
    <form action={formAction} className="space-y-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("nameEn")} htmlFor="nameEn">
          <Input id="nameEn" name="nameEn" defaultValue={product?.name_en} required invalid={!!state.fieldErrors?.nameEn} />
        </Field>
        <Field label={t("nameAr")} htmlFor="nameAr">
          <Input id="nameAr" name="nameAr" dir="rtl" defaultValue={product?.name_ar} required invalid={!!state.fieldErrors?.nameAr} />
        </Field>
      </div>

      <Field label={t("slug")} htmlFor="slug" error={fieldError("slug")}>
        <Input id="slug" name="slug" defaultValue={product?.slug} required invalid={!!state.fieldErrors?.slug} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("descriptionEn")} htmlFor="descriptionEn">
          <TextArea id="descriptionEn" name="descriptionEn" rows={4} defaultValue={product?.description_en ?? ""} />
        </Field>
        <Field label={t("descriptionAr")} htmlFor="descriptionAr">
          <TextArea id="descriptionAr" name="descriptionAr" dir="rtl" rows={4} defaultValue={product?.description_ar ?? ""} />
        </Field>
      </div>

      <Field label={t("category")} htmlFor="categoryId">
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={product?.category_id ?? ""}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 font-sans text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
        >
          <option value="">{t("noCategory")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === "ar" ? c.name_ar : c.name_en}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-4">
        <Field label={t("retailPrice")} htmlFor="retailPrice">
          <Input id="retailPrice" name="retailPrice" type="number" step="0.01" min={0} defaultValue={product?.retail_price ?? 0} required />
        </Field>
        <Field label={t("originalPrice")} htmlFor="originalPrice" error={fieldError("originalPrice")}>
          <Input id="originalPrice" name="originalPrice" type="number" step="0.01" min={0} defaultValue={product?.original_price ?? ""} />
        </Field>
        <Field label={t("wholesalePrice")} htmlFor="wholesalePrice">
          <Input id="wholesalePrice" name="wholesalePrice" type="number" step="0.01" min={0} defaultValue={product?.wholesale_price ?? ""} />
        </Field>
        <Field label={t("cost")} htmlFor="cost">
          <Input id="cost" name="cost" type="number" step="0.01" min={0} defaultValue={product?.cost ?? 0} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("stockQuantity")} htmlFor="stockQuantity">
          <Input id="stockQuantity" name="stockQuantity" type="number" min={0} defaultValue={product?.stock_quantity ?? 0} required />
        </Field>
        <Field label={t("lowStockThreshold")} htmlFor="lowStockThreshold">
          <Input id="lowStockThreshold" name="lowStockThreshold" type="number" min={0} defaultValue={product?.low_stock_threshold ?? 5} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label={t("dimensions")} htmlFor="dimensions">
          <Input id="dimensions" name="dimensions" defaultValue={product?.dimensions ?? ""} />
        </Field>
        <Field label={t("material")} htmlFor="material">
          <Input id="material" name="material" defaultValue={product?.material ?? ""} />
        </Field>
        <Field label={t("color")} htmlFor="color">
          <Input id="color" name="color" defaultValue={product?.color ?? ""} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("packageContentsEn")} htmlFor="packageContentsEn">
          <TextArea id="packageContentsEn" name="packageContentsEn" rows={2} defaultValue={product?.package_contents_en ?? ""} />
        </Field>
        <Field label={t("packageContentsAr")} htmlFor="packageContentsAr">
          <TextArea id="packageContentsAr" name="packageContentsAr" dir="rtl" rows={2} defaultValue={product?.package_contents_ar ?? ""} />
        </Field>
      </div>

      <Field label={t("videoUrl")} htmlFor="videoUrl">
        <Input id="videoUrl" name="videoUrl" type="url" placeholder="https://" defaultValue={product?.video_url ?? ""} />
      </Field>

      <label className="flex items-center gap-3 text-sm text-brand-800">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={product?.is_published ?? false}
          className="h-4 w-4 rounded border-brand-300 text-brand-900 focus:ring-accent-500"
        />
        {t("isPublished")}
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {t(state.error)}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? t("saving") : product ? t("save") : t("create")}
      </Button>
    </form>
  );
}
