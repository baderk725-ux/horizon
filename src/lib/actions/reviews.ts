"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { reviewSchema } from "@/lib/validation/reviews";

export type ReviewActionState = { error: string | null };

/**
 * Guests cannot submit at all (reviews_customer_insert RLS requires
 * customer_id = auth.uid(), which a guest session never satisfies) — only
 * a signed-in customer can review a product, at most once
 * (product_reviews_one_per_customer unique index; a duplicate insert
 * fails with 23505, mapped to a clean error here).
 */
export async function submitReviewAction(
  productId: string,
  productSlug: string,
  _prev: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const current = await getCurrentUser();
  if (!current) return { error: "not_authorized" };

  const parsed = reviewSchema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment") ?? "",
  });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase.from("product_reviews").insert({
    product_id: productId,
    customer_id: current.userId,
    rating: parsed.data.rating,
    comment: parsed.data.comment ?? null,
  });

  if (error) {
    if (error.code === "23505") return { error: "already_reviewed" };
    return { error: "save_failed" };
  }

  revalidatePath(`/product/${productSlug}`);
  return { error: null };
}

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

export async function approveReviewAction(id: string): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { error } = await supabase.from("product_reviews").update({ is_approved: true }).eq("id", id);
  if (error) return { error: "update_failed" };

  revalidatePath("/admin/reviews");
  return { error: null };
}

/** No "rejected" state exists on this table (is_approved is a plain
 * boolean) — rejecting a review is a delete, not a status flip. */
export async function deleteReviewAction(id: string): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { error } = await supabase.from("product_reviews").delete().eq("id", id);
  if (error) return { error: "delete_failed" };

  revalidatePath("/admin/reviews");
  return { error: null };
}
