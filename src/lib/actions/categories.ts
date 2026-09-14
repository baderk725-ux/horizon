"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/validation/category";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";

export type CategoryActionState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
};

function readCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    nameEn: formData.get("nameEn"),
    nameAr: formData.get("nameAr"),
    slug: formData.get("slug"),
    parentId: formData.get("parentId") ?? "",
    sortOrder: formData.get("sortOrder") || 0,
  });
}

/** Defense in depth: RLS already blocks this at the database level for
 * non-admins, but checking here lets us return a clear error instead of a
 * raw Postgres permission failure. */
async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) {
    return "not_authorized";
  }
  return null;
}

export async function createCategoryAction(
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readCategoryForm(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "invalid_input", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    name_en: parsed.data.nameEn,
    name_ar: parsed.data.nameAr,
    slug: parsed.data.slug,
    parent_id: parsed.data.parentId || null,
    sort_order: parsed.data.sortOrder,
  });

  if (error) {
    return {
      error: error.code === "23505" ? "slug_taken" : "save_failed",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/[locale]", "page");
  return { error: null };
}

export async function updateCategoryAction(
  id: string,
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readCategoryForm(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "invalid_input", fieldErrors };
  }

  if (parsed.data.parentId === id) {
    return { error: "cannot_be_own_parent" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({
      name_en: parsed.data.nameEn,
      name_ar: parsed.data.nameAr,
      slug: parsed.data.slug,
      parent_id: parsed.data.parentId || null,
      sort_order: parsed.data.sortOrder,
    })
    .eq("id", id);

  if (error) {
    return {
      error: error.code === "23505" ? "slug_taken" : "save_failed",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/[locale]", "page");
  return { error: null };
}

export async function deleteCategoryAction(
  id: string,
): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();

  // Both categories.parent_id and products.category_id are ON DELETE SET
  // NULL, so Postgres would silently orphan children/products rather than
  // reject the delete — block it here instead so nothing loses its
  // category without the admin choosing that explicitly.
  const [{ count: childCount }, { count: productCount }] = await Promise.all([
    supabase
      .from("categories")
      .select("id", { count: "exact", head: true })
      .eq("parent_id", id),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id),
  ]);

  if ((childCount ?? 0) > 0 || (productCount ?? 0) > 0) {
    return { error: "category_in_use" };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { error: "delete_failed" };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/[locale]", "page");
  return { error: null };
}
