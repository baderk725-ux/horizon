"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface ProductFormState {
  error?: string;
}

interface VariantInput {
  id?: string;
  label: string;
  swatch: string;
  priceModifier: number;
  inStock: boolean;
}

function parseVariants(raw: string): VariantInput[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((v) => v && typeof v.label === "string" && v.label.trim().length > 0)
      .map((v) => ({
        label: String(v.label).trim(),
        swatch: v.swatch ? String(v.swatch) : "",
        priceModifier: Number(v.priceModifier) || 0,
        inStock: Boolean(v.inStock),
      }));
  } catch {
    return [];
  }
}

function readProductFields(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    category_id: String(formData.get("categoryId") ?? "") || null,
    price: Number(formData.get("price") ?? 0),
    compare_at_price: formData.get("compareAtPrice")
      ? Number(formData.get("compareAtPrice"))
      : null,
    currency: String(formData.get("currency") ?? "USD"),
    short_description: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    materials: String(formData.get("materials") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    dimensions: String(formData.get("dimensions") ?? "").trim(),
    care: String(formData.get("care") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    shipping: String(formData.get("shipping") ?? "").trim(),
    badge: String(formData.get("badge") ?? "") || null,
    is_new_arrival: formData.get("isNewArrival") === "on",
    is_best_seller: formData.get("isBestSeller") === "on",
    is_featured: formData.get("isFeatured") === "on",
    is_published: formData.get("isPublished") === "on",
    in_stock: formData.get("inStock") === "on",
    seo_title: String(formData.get("seoTitle") ?? "").trim() || null,
    seo_description: String(formData.get("seoDescription") ?? "").trim() || null,
  };
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const supabase = await createClient();
  const fields = readProductFields(formData);

  if (!fields.slug || !fields.name) {
    return { error: "Name and slug are required." };
  }

  const { data, error } = await supabase.from("products").insert(fields).select("id").single();
  if (error) return { error: error.message };

  const variants = parseVariants(String(formData.get("variantsJson") ?? "[]"));
  if (variants.length > 0) {
    await supabase.from("product_variants").insert(
      variants.map((v, i) => ({
        product_id: data.id,
        label: v.label,
        swatch: v.swatch || null,
        price_modifier: v.priceModifier,
        in_stock: v.inStock,
        sort_order: i,
      }))
    );
  }

  revalidatePath("/admin/products");
  redirect(`/admin/products/${data.id}`);
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const supabase = await createClient();
  const fields = readProductFields(formData);

  if (!fields.slug || !fields.name) {
    return { error: "Name and slug are required." };
  }

  const { error } = await supabase.from("products").update(fields).eq("id", productId);
  if (error) return { error: error.message };

  const variants = parseVariants(String(formData.get("variantsJson") ?? "[]"));
  await supabase.from("product_variants").delete().eq("product_id", productId);
  if (variants.length > 0) {
    await supabase.from("product_variants").insert(
      variants.map((v, i) => ({
        product_id: productId,
        label: v.label,
        swatch: v.swatch || null,
        price_modifier: v.priceModifier,
        in_stock: v.inStock,
        sort_order: i,
      }))
    );
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
  return {};
}

export async function deleteProductAction(productId: string) {
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", productId);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
