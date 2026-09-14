import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { buildIlikeOrFilter } from "@/lib/supabase/search";

export type InventoryProductRow = Database["public"]["Tables"]["products"]["Row"] & {
  category: { name_en: string; name_ar: string } | null;
};

export type InventoryFilter = "all" | "low" | "out";

/**
 * Reads `products` directly (admin-only table, not the public
 * products_storefront view) — filtering by stock level happens in memory
 * since low_stock_threshold is per-row (no fixed number to filter by in
 * SQL without duplicating that comparison here and risking it drifting
 * from notify_low_stock()'s own `<=` threshold logic).
 */
export async function getInventoryProducts(params: {
  filter?: InventoryFilter;
  search?: string;
}): Promise<InventoryProductRow[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, category:categories(name_en, name_ar)")
    .order("stock_quantity", { ascending: true });

  if (params.search?.trim()) {
    query = query.or(buildIlikeOrFilter(["name_en", "name_ar", "slug"], params.search.trim()));
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data ?? []) as InventoryProductRow[];
  if (params.filter === "low") {
    return rows.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold);
  }
  if (params.filter === "out") {
    return rows.filter((p) => p.stock_quantity === 0);
  }
  return rows;
}
