"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface CategoryFormState {
  error?: string;
}

function readFields(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    placeholder_icon: String(formData.get("placeholderIcon") ?? "home-decor"),
    placeholder_tone: String(formData.get("placeholderTone") ?? "sand"),
    sort_order: Number(formData.get("sortOrder") ?? 0),
  };
}

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const supabase = await createClient();
  const fields = readFields(formData);
  if (!fields.slug || !fields.name) return { error: "Name and slug are required." };

  const { error } = await supabase.from("categories").insert(fields);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  redirect("/admin/categories");
}

export async function updateCategoryAction(
  categoryId: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const supabase = await createClient();
  const fields = readFields(formData);
  if (!fields.slug || !fields.name) return { error: "Name and slug are required." };

  const { error } = await supabase.from("categories").update(fields).eq("id", categoryId);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(categoryId: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", categoryId);
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  redirect("/admin/categories");
}
