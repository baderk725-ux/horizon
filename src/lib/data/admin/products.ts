import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { buildIlikeOrFilter } from "@/lib/supabase/search";

export type AdminProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductImageRow =
  Database["public"]["Tables"]["product_images"]["Row"];

export type AdminProductListItem = AdminProductRow & {
  category: { id: string; name_en: string; name_ar: string } | null;
  thumbnail: string | null;
};

/**
 * Full product rows for the admin console. Reads the `products` table
 * directly (not the public `products_storefront` view) since the caller
 * must be an admin for RLS to allow this at all.
 */
export async function getAdminProducts(search?: string): Promise<AdminProductListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      "*, category:categories(id, name_en, name_ar), product_images(url, sort_order)",
    )
    .order("created_at", { ascending: false });

  if (search && search.trim()) {
    query = query.or(buildIlikeOrFilter(["name_en", "name_ar", "slug"], search.trim()));
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => {
    const { product_images, ...rest } = row as typeof row & {
      product_images: Pick<ProductImageRow, "url" | "sort_order">[];
    };
    const sorted = [...product_images].sort((a, b) => a.sort_order - b.sort_order);
    return { ...rest, thumbnail: sorted[0]?.url ?? null };
  });
}

export async function getAdminProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}
