"use client";

import { useActionState } from "react";
import type { Category, PlaceholderIcon, PlaceholderTone } from "@/lib/types";
import { AdminButton, AdminField, AdminInput, AdminTextarea } from "../_components/ui";
import { createCategoryAction, updateCategoryAction, type CategoryFormState } from "./actions";

const ICONS: PlaceholderIcon[] = [
  "kitchen",
  "macrame",
  "rugs",
  "home-decor",
  "tableware",
  "textiles",
  "gifts",
];
const TONES: PlaceholderTone[] = ["ivory", "sand", "taupe", "charcoal"];

const initialState: CategoryFormState = {};

export function CategoryForm({ category }: { category?: Category }) {
  const action = category ? updateCategoryAction.bind(null, category.id) : createCategoryAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <AdminField label="Name">
          <AdminInput name="name" required defaultValue={category?.name} />
        </AdminField>
        <AdminField label="Slug" hint="Used in the storefront URL, e.g. /shop/your-slug">
          <AdminInput name="slug" required defaultValue={category?.slug} />
        </AdminField>
      </div>

      <AdminField label="Description">
        <AdminTextarea name="description" rows={3} defaultValue={category?.description} />
      </AdminField>

      <div className="grid gap-6 md:grid-cols-3">
        <AdminField label="Placeholder Icon" hint="Used until you upload a real category photo">
          <select
            name="placeholderIcon"
            defaultValue={category?.placeholderIcon ?? "home-decor"}
            className="border border-[#e2d8c8] bg-white px-3 py-2.5 text-sm text-[#1a1714] focus:border-[#1a1714] focus:outline-none"
          >
            {ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Placeholder Tone">
          <select
            name="placeholderTone"
            defaultValue={category?.placeholderTone ?? "sand"}
            className="border border-[#e2d8c8] bg-white px-3 py-2.5 text-sm text-[#1a1714] focus:border-[#1a1714] focus:outline-none"
          >
            {TONES.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Sort Order" hint="Lower numbers appear first">
          <AdminInput type="number" name="sortOrder" defaultValue={category?.sortOrder ?? 0} />
        </AdminField>
      </div>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}

      <div>
        <AdminButton type="submit" disabled={pending}>
          {pending ? "Saving…" : category ? "Save Changes" : "Create Category"}
        </AdminButton>
      </div>
    </form>
  );
}
