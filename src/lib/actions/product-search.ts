"use server";

import { createClient } from "@/lib/supabase/server";
import { buildIlikeOrFilter } from "@/lib/supabase/search";

export type ProductSearchResult = {
  id: string;
  nameEn: string;
  nameAr: string;
  retailPrice: number;
  stockQuantity: number;
};

/**
 * Reads the same public products_storefront view the storefront itself
 * uses — real published products with real live stock, never a mocked
 * picker list. Used by the manual-order product picker.
 */
export async function searchProductsAction(query: string): Promise<ProductSearchResult[]> {
  const supabase = await createClient();
  const term = query.trim();

  let request = supabase
    .from("products_storefront")
    .select("id, name_en, name_ar, retail_price, stock_quantity")
    .order("name_en", { ascending: true })
    .limit(20);

  if (term) {
    request = request.or(buildIlikeOrFilter(["name_en", "name_ar"], term));
  }

  const { data, error } = await request;
  if (error) throw error;

  return (data ?? []).map((p) => ({
    id: p.id!,
    nameEn: p.name_en!,
    nameAr: p.name_ar!,
    retailPrice: p.retail_price ?? 0,
    stockQuantity: p.stock_quantity ?? 0,
  }));
}
