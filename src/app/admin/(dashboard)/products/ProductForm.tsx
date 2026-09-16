"use client";

import { useActionState, useState } from "react";
import type { Category, Product, ProductVariant } from "@/lib/types";
import { AdminButton, AdminCheckboxLabel, AdminField, AdminInput, AdminTextarea } from "../_components/ui";
import { createProductAction, updateProductAction, type ProductFormState } from "./actions";

interface VariantRow {
  key: string;
  label: string;
  swatch: string;
  priceModifier: number;
  inStock: boolean;
}

function toVariantRows(variants?: ProductVariant[]): VariantRow[] {
  return (variants ?? []).map((v) => ({
    key: v.id,
    label: v.label,
    swatch: v.swatch ?? "",
    priceModifier: v.priceModifier ?? 0,
    inStock: v.inStock,
  }));
}

const initialState: ProductFormState = {};

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const action = product ? updateProductAction.bind(null, product.id) : createProductAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [variants, setVariants] = useState<VariantRow[]>(toVariantRows(product?.variants));

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      { key: crypto.randomUUID(), label: "", swatch: "", priceModifier: 0, inStock: true },
    ]);
  }

  function updateVariant(key: string, patch: Partial<VariantRow>) {
    setVariants((prev) => prev.map((v) => (v.key === key ? { ...v, ...patch } : v)));
  }

  function removeVariant(key: string) {
    setVariants((prev) => prev.filter((v) => v.key !== key));
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <input type="hidden" name="variantsJson" value={JSON.stringify(variants)} />

      <div className="grid gap-6 md:grid-cols-2">
        <AdminField label="Product Name">
          <AdminInput name="name" required defaultValue={product?.name} />
        </AdminField>
        <AdminField label="Slug" hint="Used in the storefront URL, e.g. /product/your-slug">
          <AdminInput name="slug" required defaultValue={product?.slug} />
        </AdminField>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <AdminField label="Category">
          <select
            name="categoryId"
            defaultValue={product?.categoryId ?? categories[0]?.id}
            className="border border-[#e2d8c8] bg-white px-3 py-2.5 text-sm text-[#1a1714] focus:border-[#1a1714] focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Price (USD)">
          <AdminInput type="number" step="0.01" min="0" name="price" required defaultValue={product?.price} />
        </AdminField>
        <AdminField label="Compare-at Price" hint="Optional — shows as a strikethrough price">
          <AdminInput type="number" step="0.01" min="0" name="compareAtPrice" defaultValue={product?.compareAtPrice ?? ""} />
        </AdminField>
      </div>

      <AdminField label="Short Description" hint="Shown on product cards and near the price">
        <AdminInput name="shortDescription" required defaultValue={product?.shortDescription} />
      </AdminField>

      <AdminField label="Full Description">
        <AdminTextarea name="description" required rows={4} defaultValue={product?.description} />
      </AdminField>

      <div className="grid gap-6 md:grid-cols-2">
        <AdminField label="Materials" hint="One per line">
          <AdminTextarea name="materials" rows={3} defaultValue={product?.materials.join("\n")} />
        </AdminField>
        <AdminField label="Care Instructions" hint="One per line">
          <AdminTextarea name="care" rows={3} defaultValue={product?.care.join("\n")} />
        </AdminField>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AdminField label="Dimensions">
          <AdminInput name="dimensions" defaultValue={product?.dimensions} />
        </AdminField>
        <AdminField label="Shipping Note">
          <AdminInput name="shipping" defaultValue={product?.shipping} />
        </AdminField>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-medium uppercase tracking-[0.1em] text-[#6b5c48]">Variants</h3>
          <button type="button" onClick={addVariant} className="text-xs uppercase tracking-[0.1em] text-[#1a1714] underline underline-offset-4">
            + Add Variant
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {variants.map((v) => (
            <div key={v.key} className="grid grid-cols-[1fr_1fr_100px_auto_auto] items-center gap-2">
              <AdminInput
                placeholder="Label (e.g. Sand)"
                value={v.label}
                onChange={(e) => updateVariant(v.key, { label: e.target.value })}
              />
              <AdminInput
                placeholder="Swatch hex (optional)"
                value={v.swatch}
                onChange={(e) => updateVariant(v.key, { swatch: e.target.value })}
              />
              <AdminInput
                type="number"
                step="0.01"
                placeholder="+price"
                value={v.priceModifier}
                onChange={(e) => updateVariant(v.key, { priceModifier: Number(e.target.value) })}
              />
              <AdminCheckboxLabel>
                <input
                  type="checkbox"
                  checked={v.inStock}
                  onChange={(e) => updateVariant(v.key, { inStock: e.target.checked })}
                />
                In stock
              </AdminCheckboxLabel>
              <button type="button" onClick={() => removeVariant(v.key)} className="text-xs text-red-700">
                Remove
              </button>
            </div>
          ))}
          {variants.length === 0 ? <p className="text-sm text-[#9a8b73]">No variants — this is a single-option product.</p> : null}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AdminField label="Badge" hint="Optional label shown on the product card">
          <select
            name="badge"
            defaultValue={product?.badge ?? ""}
            className="border border-[#e2d8c8] bg-white px-3 py-2.5 text-sm text-[#1a1714] focus:border-[#1a1714] focus:outline-none"
          >
            <option value="">None</option>
            <option value="New">New</option>
            <option value="Best Seller">Best Seller</option>
            <option value="Limited">Limited</option>
          </select>
        </AdminField>
        <div className="flex flex-wrap items-center gap-6">
          <AdminCheckboxLabel>
            <input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} /> In Stock
          </AdminCheckboxLabel>
          <AdminCheckboxLabel>
            <input type="checkbox" name="isPublished" defaultChecked={product?.isPublished ?? true} /> Published
          </AdminCheckboxLabel>
          <AdminCheckboxLabel>
            <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} /> Featured
          </AdminCheckboxLabel>
          <AdminCheckboxLabel>
            <input type="checkbox" name="isNewArrival" defaultChecked={product?.isNewArrival ?? false} /> New Arrival
          </AdminCheckboxLabel>
          <AdminCheckboxLabel>
            <input type="checkbox" name="isBestSeller" defaultChecked={product?.isBestSeller ?? false} /> Best Seller
          </AdminCheckboxLabel>
        </div>
      </div>

      <div className="border-t border-[#e2d8c8] pt-6">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-[#6b5c48]">SEO</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <AdminField label="SEO Title" hint="Falls back to the product name">
            <AdminInput name="seoTitle" defaultValue={product?.seoTitle ?? ""} />
          </AdminField>
          <AdminField label="Meta Description" hint="Falls back to the short description">
            <AdminInput name="seoDescription" defaultValue={product?.seoDescription ?? ""} />
          </AdminField>
        </div>
      </div>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}

      <div>
        <AdminButton type="submit" disabled={pending}>
          {pending ? "Saving…" : product ? "Save Changes" : "Create Product"}
        </AdminButton>
      </div>
    </form>
  );
}
