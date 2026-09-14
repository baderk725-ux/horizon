import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type AdminCollectionRow = Database["public"]["Tables"]["collections"]["Row"];

export async function getAdminCollections(): Promise<AdminCollectionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export type CollectionProductLine = {
  productId: string;
  nameEn: string;
  nameAr: string;
  sortOrder: number;
};

export type AdminCollectionDetail = AdminCollectionRow & { products: CollectionProductLine[] };

export async function getAdminCollectionById(id: string): Promise<AdminCollectionDetail | null> {
  const supabase = await createClient();
  const { data: collection } = await supabase.from("collections").select("*").eq("id", id).maybeSingle();
  if (!collection) return null;

  const { data: items } = await supabase
    .from("collection_products")
    .select("product_id, sort_order, product:products(id, name_en, name_ar)")
    .eq("collection_id", id)
    .order("sort_order", { ascending: true });

  const products: CollectionProductLine[] = (items ?? [])
    .map((item) => {
      const product = item.product as unknown as { id: string; name_en: string; name_ar: string } | null;
      if (!product) return null;
      return { productId: product.id, nameEn: product.name_en, nameAr: product.name_ar, sortOrder: item.sort_order };
    })
    .filter((p): p is CollectionProductLine => p !== null);

  return { ...collection, products };
}
