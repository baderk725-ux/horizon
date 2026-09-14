import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { ProductCardData } from "@/components/storefront/product-card";

type StorefrontProductViewRow =
  Database["public"]["Views"]["products_storefront"]["Row"];

/**
 * Shared mapper: `products_storefront` rows (nullable columns, since it's a
 * view) → the shape ProductCard/checkout/etc. actually need. Used by both
 * the homepage and shop listing so the "attach images, coerce nulls" logic
 * lives in exactly one place.
 */
export async function attachImagesToProducts(
  products: StorefrontProductViewRow[],
): Promise<ProductCardData[]> {
  const ids = products.map((p) => p.id).filter((id): id is string => !!id);
  if (ids.length === 0) return [];

  const supabase = await createClient();
  const { data: images, error } = await supabase
    .from("product_images")
    .select("product_id, url, sort_order")
    .in("product_id", ids);

  if (error) throw error;

  const byProduct = new Map<string, ProductCardData["images"]>();
  for (const image of images ?? []) {
    if (!image.product_id) continue;
    const list = byProduct.get(image.product_id) ?? [];
    list.push({ url: image.url, sort_order: image.sort_order });
    byProduct.set(image.product_id, list);
  }

  return products.map((p) => ({
    id: p.id!,
    slug: p.slug!,
    name_en: p.name_en!,
    name_ar: p.name_ar!,
    retail_price: p.retail_price ?? 0,
    original_price: p.original_price,
    stock_quantity: p.stock_quantity ?? 0,
    images: byProduct.get(p.id!) ?? [],
  }));
}
