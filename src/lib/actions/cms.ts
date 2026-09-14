"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { siteContentEntrySchema, faqSchema } from "@/lib/validation/cms";

export type CmsActionState = { error: string | null };

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

/** One form submits every editable site_content row at once — field names
 * are `content:<key>:en` / `content:<key>:ar`, so the set of keys to write
 * is discovered from the submitted form itself rather than hardcoded here. */
export async function updateSiteContentAction(
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const keys = new Set<string>();
  for (const fieldName of formData.keys()) {
    const match = fieldName.match(/^content:(.+):(en|ar)$/);
    if (match) keys.add(match[1]);
  }
  if (keys.size === 0) return { error: null };

  const supabase = await createClient();
  const results = await Promise.all(
    Array.from(keys).map(async (key) => {
      const parsed = siteContentEntrySchema.safeParse({
        key,
        valueEn: formData.get(`content:${key}:en`) ?? "",
        valueAr: formData.get(`content:${key}:ar`) ?? "",
      });
      if (!parsed.success) return false;
      const { error } = await supabase
        .from("site_content")
        .update({
          value_en: parsed.data.valueEn ?? null,
          value_ar: parsed.data.valueAr ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("key", key);
      return !error;
    }),
  );

  if (results.some((ok) => !ok)) return { error: "save_failed" };

  revalidatePath("/admin/content");
  revalidatePath("/");
  return { error: null };
}

export async function createFaqAction(
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = faqSchema.safeParse({
    questionEn: formData.get("questionEn"),
    questionAr: formData.get("questionAr"),
    answerEn: formData.get("answerEn"),
    answerAr: formData.get("answerAr"),
    sortOrder: formData.get("sortOrder") ?? "0",
    isActive: formData.get("isActive"),
  });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase.from("faqs").insert({
    question_en: parsed.data.questionEn,
    question_ar: parsed.data.questionAr,
    answer_en: parsed.data.answerEn,
    answer_ar: parsed.data.answerAr,
    sort_order: parsed.data.sortOrder,
    is_active: parsed.data.isActive,
  });
  if (error) return { error: "save_failed" };

  revalidatePath("/admin/content");
  revalidatePath("/faq");
  return { error: null };
}

export async function updateFaqAction(
  id: string,
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = faqSchema.safeParse({
    questionEn: formData.get("questionEn"),
    questionAr: formData.get("questionAr"),
    answerEn: formData.get("answerEn"),
    answerAr: formData.get("answerAr"),
    sortOrder: formData.get("sortOrder") ?? "0",
    isActive: formData.get("isActive"),
  });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("faqs")
    .update({
      question_en: parsed.data.questionEn,
      question_ar: parsed.data.questionAr,
      answer_en: parsed.data.answerEn,
      answer_ar: parsed.data.answerAr,
      sort_order: parsed.data.sortOrder,
      is_active: parsed.data.isActive,
    })
    .eq("id", id);
  if (error) return { error: "save_failed" };

  revalidatePath("/admin/content");
  revalidatePath("/faq");
  return { error: null };
}

export async function deleteFaqAction(id: string): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) return { error: "delete_failed" };

  revalidatePath("/admin/content");
  revalidatePath("/faq");
  return { error: null };
}
