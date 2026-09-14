"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { buildIlikeOrFilter } from "@/lib/supabase/search";

export type AdminProductSearchResult = {
  id: string;
  nameEn: string;
  nameAr: string;
  cost: number;
};

/** Admin-only (reads the raw `products` table, including cost — never
 * exposed on the public products_storefront view). Used by the purchase
 * order item picker, where staff need to see and set purchase cost, not
 * the retail/wholesale selling price. */
export async function searchProductsForPurchaseOrderAction(query: string): Promise<AdminProductSearchResult[]> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return [];

  const supabase = await createClient();
  const term = query.trim();

  let request = supabase
    .from("products")
    .select("id, name_en, name_ar, cost")
    .order("name_en", { ascending: true })
    .limit(20);

  if (term) {
    request = request.or(buildIlikeOrFilter(["name_en", "name_ar"], term));
  }

  const { data, error } = await request;
  if (error) throw error;

  return (data ?? []).map((p) => ({ id: p.id, nameEn: p.name_en, nameAr: p.name_ar, cost: p.cost }));
}
