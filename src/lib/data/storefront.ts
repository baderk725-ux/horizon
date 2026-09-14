import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type ProductCard = Database["public"]["Tables"]["products"]["Row"] & {
  product_images: Pick<
    Database["public"]["Tables"]["product_images"]["Row"],
    "url" | "sort_order"
  >[];
};

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type CollectionRow =
  Database["public"]["Tables"]["collections"]["Row"];

/** Top-level categories (no parent), ordered for storefront navigation/grid. */
export async function getTopCategories(): Promise<CategoryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .is("parent_id", null)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Collections placed on the homepage, in admin-defined order. */
export async function getHomeCollections(): Promise<CollectionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("placement", "home")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Published products with their primary image, most recent first. */
export async function getPublishedProducts(
  limit = 8,
): Promise<ProductCard[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(url, sort_order)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as ProductCard[]) ?? [];
}
