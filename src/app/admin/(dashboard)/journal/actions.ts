"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface JournalFormState {
  error?: string;
}

function readFields(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    published_at: String(formData.get("publishedAt") ?? "").trim() || new Date().toISOString().slice(0, 10),
    placeholder_icon: String(formData.get("placeholderIcon") ?? "home-decor"),
    content: String(formData.get("content") ?? "")
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean),
    is_published: formData.get("isPublished") === "on",
    seo_title: String(formData.get("seoTitle") ?? "").trim() || null,
    seo_description: String(formData.get("seoDescription") ?? "").trim() || null,
  };
}

export async function createJournalPostAction(
  _prevState: JournalFormState,
  formData: FormData
): Promise<JournalFormState> {
  const supabase = await createClient();
  const fields = readFields(formData);
  if (!fields.slug || !fields.title) return { error: "Title and slug are required." };

  const { error } = await supabase.from("journal_posts").insert(fields);
  if (error) return { error: error.message };

  revalidatePath("/admin/journal");
  revalidatePath("/journal");
  redirect("/admin/journal");
}

export async function updateJournalPostAction(
  postId: string,
  _prevState: JournalFormState,
  formData: FormData
): Promise<JournalFormState> {
  const supabase = await createClient();
  const fields = readFields(formData);
  if (!fields.slug || !fields.title) return { error: "Title and slug are required." };

  const { error } = await supabase.from("journal_posts").update(fields).eq("id", postId);
  if (error) return { error: error.message };

  revalidatePath("/admin/journal");
  revalidatePath("/journal");
  redirect("/admin/journal");
}

export async function deleteJournalPostAction(postId: string) {
  const supabase = await createClient();
  await supabase.from("journal_posts").delete().eq("id", postId);
  revalidatePath("/admin/journal");
  revalidatePath("/journal");
  redirect("/admin/journal");
}
