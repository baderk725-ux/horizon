"use client";

import { useActionState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  createCategoryAction,
  updateCategoryAction,
  type CategoryActionState,
} from "@/lib/actions/categories";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CategoryRow } from "@/lib/data/admin/categories";

const initialState: CategoryActionState = { error: null };

export function CategoryForm({
  category,
  parentOptions,
}: {
  category?: CategoryRow;
  parentOptions: CategoryRow[];
}) {
  const t = useTranslations("adminCategories");
  const locale = useLocale();

  const action = category
    ? updateCategoryAction.bind(null, category.id)
    : createCategoryAction;

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("nameEn")} htmlFor="nameEn">
          <Input
            id="nameEn"
            name="nameEn"
            defaultValue={category?.name_en}
            required
            invalid={!!state.fieldErrors?.nameEn}
          />
        </Field>
        <Field label={t("nameAr")} htmlFor="nameAr">
          <Input
            id="nameAr"
            name="nameAr"
            dir="rtl"
            defaultValue={category?.name_ar}
            required
            invalid={!!state.fieldErrors?.nameAr}
          />
        </Field>
      </div>

      <Field
        label={t("slug")}
        htmlFor="slug"
        error={state.fieldErrors?.slug === "slug_format" ? t("slug_format") : undefined}
      >
        <Input
          id="slug"
          name="slug"
          defaultValue={category?.slug}
          placeholder="kitchenware"
          required
          invalid={!!state.fieldErrors?.slug}
        />
      </Field>

      <Field label={t("parent")} htmlFor="parentId">
        <select
          id="parentId"
          name="parentId"
          defaultValue={category?.parent_id ?? ""}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 font-sans text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
        >
          <option value="">{t("noParent")}</option>
          {parentOptions
            .filter((c) => c.id !== category?.id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {locale === "ar" ? c.name_ar : c.name_en}
              </option>
            ))}
        </select>
      </Field>

      <Field label={t("sortOrder")} htmlFor="sortOrder">
        <Input
          id="sortOrder"
          name="sortOrder"
          type="number"
          min={0}
          defaultValue={category?.sort_order ?? 0}
        />
      </Field>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {t(state.error)}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? t("saving") : category ? t("save") : t("create")}
      </Button>
    </form>
  );
}
