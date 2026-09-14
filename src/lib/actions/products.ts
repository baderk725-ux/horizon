"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/validation/product";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";

export type ProductActionState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
};

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) {
    return "not_authorized";
  }
  return null;
}

function readProductForm(formData: FormData) {
  return productSchema.safeParse({
    nameEn: formData.get("nameEn"),
    nameAr: formData.get("nameAr"),
    slug: formData.get("slug"),
    descriptionEn: formData.get("descriptionEn") ?? "",
    descriptionAr: formData.get("descriptionAr") ?? "",
    categoryId: formData.get("categoryId") ?? "",
    retailPrice: formData.get("retailPrice"),
    originalPrice: formData.get("originalPrice") ?? "",
    wholesalePrice: formData.get("wholesalePrice") ?? "",
    cost: formData.get("cost") || 0,
    stockQuantity: formData.get("stockQuantity") || 0,
    lowStockThreshold: formData.get("lowStockThreshold") || 5,
    dimensions: formData.get("dimensions") ?? "",
    material: formData.get("material") ?? "",
    color: formData.get("color") ?? "",
    packageContentsEn: formData.get("packageContentsEn") ?? "",
    packageContentsAr: formData.get("packageContentsAr") ?? "",
    videoUrl: formData.get("videoUrl") ?? "",
    isPublished: formData.get("isPublished") === "on",
  });
}

function fieldErrorsFrom(error: import("zod").ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    fieldErrors[String(issue.path[0])] = issue.message;
  }
  return fieldErrors;
}

export async function createProductAction(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readProductForm(formData);
  if (!parsed.success) {
    return { error: "invalid_input", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name_en: parsed.data.nameEn,
      name_ar: parsed.data.nameAr,
      slug: parsed.data.slug,
      description_en: parsed.data.descriptionEn || null,
      description_ar: parsed.data.descriptionAr || null,
      category_id: parsed.data.categoryId || null,
      retail_price: parsed.data.retailPrice,
      original_price: parsed.data.originalPrice ?? null,
      wholesale_price: parsed.data.wholesalePrice ?? null,
      cost: parsed.data.cost,
      stock_quantity: parsed.data.stockQuantity,
      low_stock_threshold: parsed.data.lowStockThreshold,
      dimensions: parsed.data.dimensions || null,
      material: parsed.data.material || null,
      color: parsed.data.color || null,
      package_contents_en: parsed.data.packageContentsEn || null,
      package_contents_ar: parsed.data.packageContentsAr || null,
      video_url: parsed.data.videoUrl || null,
      is_published: parsed.data.isPublished,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.code === "23505" ? "slug_taken" : "save_failed" };
  }

  revalidatePath("/admin/products");
  revalidatePath("/[locale]", "page");
  const locale = await getLocale();
  return redirect({ href: `/admin/products/${data.id}`, locale });
}

export async function updateProductAction(
  id: string,
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readProductForm(formData);
  if (!parsed.success) {
    return { error: "invalid_input", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      name_en: parsed.data.nameEn,
      name_ar: parsed.data.nameAr,
      slug: parsed.data.slug,
      description_en: parsed.data.descriptionEn || null,
      description_ar: parsed.data.descriptionAr || null,
      category_id: parsed.data.categoryId || null,
      retail_price: parsed.data.retailPrice,
      original_price: parsed.data.originalPrice ?? null,
      wholesale_price: parsed.data.wholesalePrice ?? null,
      cost: parsed.data.cost,
      stock_quantity: parsed.data.stockQuantity,
      low_stock_threshold: parsed.data.lowStockThreshold,
      dimensions: parsed.data.dimensions || null,
      material: parsed.data.material || null,
      color: parsed.data.color || null,
      package_contents_en: parsed.data.packageContentsEn || null,
      package_contents_ar: parsed.data.packageContentsAr || null,
      video_url: parsed.data.videoUrl || null,
      is_published: parsed.data.isPublished,
    })
    .eq("id", id);

  if (error) {
    return { error: error.code === "23505" ? "slug_taken" : "save_failed" };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/[locale]", "page");
  return { error: null };
}

export async function deleteProductAction(
  id: string,
): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();

  // order_items.product_id is ON DELETE SET NULL in the schema too, but an
  // order line losing its product reference is a real data-integrity
  // problem (unlike categories) — never allow deleting a product that has
  // been ordered.
  const { count: orderItemCount } = await supabase
    .from("order_items")
    .select("id", { count: "exact", head: true })
    .eq("product_id", id);

  if ((orderItemCount ?? 0) > 0) {
    return { error: "product_has_orders" };
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    return { error: "delete_failed" };
  }

  revalidatePath("/admin/products");
  revalidatePath("/[locale]", "page");
  return { error: null };
}

export async function toggleProductPublishedAction(
  id: string,
  nextValue: boolean,
): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_published: nextValue })
    .eq("id", id);

  if (error) return { error: "save_failed" };

  revalidatePath("/admin/products");
  revalidatePath("/[locale]", "page");
  return { error: null };
}
