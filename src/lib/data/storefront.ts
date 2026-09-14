import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type CollectionRow =
  Database["public"]["Tables"]["collections"]["Row"];

type StorefrontProductViewRow =
  Database["public"]["Views"]["products_storefront"]["Row"];
type ProductImageRow =
  Database["public"]["Tables"]["product_images"]["Row"];

/**
 * The `products` table has no public SELECT policy (RLS restricts it to
 * admins and approved wholesale customers) — anonymous/retail reads must go
 * through the `products_storefront` view, which already filters to
 * `is_published = true` and excludes cost/wholesale-only columns.
 */
export type ProductCard = Omit<StorefrontProductViewRow, "id" | "slug" | "name_en" | "name_ar" | "retail_price" | "stock_quantity"> & {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  retail_price: number;
  stock_quantity: number;
  images: Pick<ProductImageRow, "url" | "sort_order">[];
};

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

/** Published, storefront-safe products with their images, most recent first. */
export async function getPublishedProducts(
  limit = 8,
): Promise<ProductCard[]> {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products_storefront")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  if (!products || products.length === 0) return [];

  const productIds = products.map((p) => p.id).filter((id): id is string => !!id);

  const { data: images, error: imagesError } = await supabase
    .from("product_images")
    .select("product_id, url, sort_order")
    .in("product_id", productIds);

  if (imagesError) throw imagesError;

  const imagesByProduct = new Map<string, ProductCard["images"]>();
  for (const image of images ?? []) {
    if (!image.product_id) continue;
    const list = imagesByProduct.get(image.product_id) ?? [];
    list.push({ url: image.url, sort_order: image.sort_order });
    imagesByProduct.set(image.product_id, list);
  }

  return products.map((p) => ({
    ...p,
    id: p.id!,
    slug: p.slug!,
    name_en: p.name_en!,
    name_ar: p.name_ar!,
    retail_price: p.retail_price ?? 0,
    stock_quantity: p.stock_quantity ?? 0,
    images: imagesByProduct.get(p.id!) ?? [],
  }));
}
