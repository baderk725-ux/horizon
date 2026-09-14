import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type AdminBundleRow = Database["public"]["Tables"]["bundles"]["Row"];

export type AdminBundleListItem = AdminBundleRow & { productCount: number };

export async function getAdminBundles(): Promise<AdminBundleListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bundles")
    .select("*, bundle_products(product_id)")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => {
    const { bundle_products, ...rest } = row as typeof row & {
      bundle_products: { product_id: string }[];
    };
    return { ...rest, productCount: bundle_products.length };
  });
}

export type BundleProductLine = {
  productId: string;
  nameEn: string;
  nameAr: string;
  retailPrice: number;
  quantity: number;
};

export type AdminBundleDetail = AdminBundleRow & { products: BundleProductLine[] };

export async function getAdminBundleById(id: string): Promise<AdminBundleDetail | null> {
  const supabase = await createClient();
  const { data: bundle } = await supabase.from("bundles").select("*").eq("id", id).maybeSingle();
  if (!bundle) return null;

  const { data: items } = await supabase
    .from("bundle_products")
    .select("product_id, quantity, product:products(id, name_en, name_ar, retail_price)")
    .eq("bundle_id", id);

  const products: BundleProductLine[] = (items ?? [])
    .map((item) => {
      const product = item.product as unknown as {
        id: string;
        name_en: string;
        name_ar: string;
        retail_price: number;
      } | null;
      if (!product) return null;
      return {
        productId: product.id,
        nameEn: product.name_en,
        nameAr: product.name_ar,
        retailPrice: product.retail_price,
        quantity: item.quantity,
      };
    })
    .filter((p): p is BundleProductLine => p !== null);

  return { ...bundle, products };
}
