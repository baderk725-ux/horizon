import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type AdminReviewRow = Database["public"]["Tables"]["product_reviews"]["Row"] & {
  product: { name_en: string; name_ar: string } | null;
};

export async function getAdminReviews(params: { pendingOnly?: boolean }): Promise<AdminReviewRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("product_reviews")
    .select("*, product:products(name_en, name_ar)")
    .order("created_at", { ascending: false });
  if (params.pendingOnly) query = query.eq("is_approved", false);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as AdminReviewRow[];
}

export type ReviewStats = {
  approvedCount: number;
  pendingCount: number;
  averageRating: number | null;
};

export async function getReviewStats(): Promise<ReviewStats> {
  const supabase = await createClient();
  const [{ count: pendingCount }, { data: approved }] = await Promise.all([
    supabase.from("product_reviews").select("id", { count: "exact", head: true }).eq("is_approved", false),
    supabase.from("product_reviews").select("rating").eq("is_approved", true),
  ]);

  const approvedRows = approved ?? [];
  const averageRating =
    approvedRows.length > 0 ? approvedRows.reduce((sum, r) => sum + r.rating, 0) / approvedRows.length : null;

  return { approvedCount: approvedRows.length, pendingCount: pendingCount ?? 0, averageRating };
}
