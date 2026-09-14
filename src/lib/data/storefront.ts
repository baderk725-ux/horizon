import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { ProductCardData } from "@/components/storefront/product-card";
import { attachImagesToProducts } from "@/lib/data/product-listing";

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type CollectionRow =
  Database["public"]["Tables"]["collections"]["Row"];

/**
 * The `products` table has no public SELECT policy (RLS restricts it to
 * admins and approved wholesale customers) — anonymous/retail reads must go
 * through the `products_storefront` view, which already filters to
 * `is_published = true` and excludes cost/wholesale-only columns.
 */
export type ProductCard = ProductCardData;

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

/** Every active collection, for the /collections index. */
export async function getActiveCollections(): Promise<CollectionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export type CollectionWithProducts = CollectionRow & { products: ProductCard[] };

/** A single active collection with its member products, for /collection/[slug].
 * Returns null for an unknown or inactive slug (admin preview aside), never a
 * thrown error, so the page can render a clean 404. */
export async function getCollectionBySlug(slug: string): Promise<CollectionWithProducts | null> {
  const supabase = await createClient();
  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (!collection) return null;

  const { data: links } = await supabase
    .from("collection_products")
    .select("product_id, sort_order")
    .eq("collection_id", collection.id)
    .order("sort_order", { ascending: true });

  const productIds = (links ?? []).map((l) => l.product_id);
  if (productIds.length === 0) return { ...collection, products: [] };

  const { data: products } = await supabase
    .from("products_storefront")
    .select("*")
    .in("id", productIds);

  const byId = new Map((products ?? []).map((p) => [p.id, p]));
  const ordered = productIds.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => !!p);

  return { ...collection, products: await attachImagesToProducts(ordered) };
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
  return attachImagesToProducts(products ?? []);
}
