import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { ProductCardData } from "@/components/storefront/product-card";
import { attachImagesToProducts } from "@/lib/data/product-listing";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export type ShopProduct = ProductCardData;
export type ShopSort = "newest" | "price_asc" | "price_desc";

const PAGE_SIZE = 12;

export async function getShopProducts(params: {
  categorySlug?: string;
  search?: string;
  sort?: ShopSort;
  page?: number;
}): Promise<{ products: ShopProduct[]; total: number; page: number; pageCount: number }> {
  const supabase = await createClient();
  const page = Math.max(1, params.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let categoryId: string | undefined;
  if (params.categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.categorySlug)
      .maybeSingle();
    categoryId = category?.id;
    if (!categoryId) return { products: [], total: 0, page, pageCount: 0 };
  }

  let query = supabase.from("products_storefront").select("*", { count: "exact" });

  if (categoryId) query = query.eq("category_id", categoryId);
  if (params.search?.trim()) {
    const term = params.search.trim();
    query = query.or(`name_en.ilike.%${term}%,name_ar.ilike.%${term}%`);
  }

  switch (params.sort) {
    case "price_asc":
      query = query.order("retail_price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("retail_price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  const products = await attachImagesToProducts(data ?? []);
  const total = count ?? 0;

  return {
    products,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export type ProductDetail = ShopProduct & {
  description_en: string | null;
  description_ar: string | null;
  dimensions: string | null;
  material: string | null;
  color: string | null;
  package_contents_en: string | null;
  package_contents_ar: string | null;
  video_url: string | null;
  category: Pick<CategoryRow, "id" | "slug" | "name_en" | "name_ar"> | null;
  reviews: { rating: number; comment: string | null; created_at: string }[];
  averageRating: number | null;
  reviewCount: number;
  related: ShopProduct[];
};

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products_storefront")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!product) return null;

  const [[card], { data: category }, { data: reviews }, { data: relations }] =
    await Promise.all([
      attachImagesToProducts([product]),
      product.category_id
        ? supabase
            .from("categories")
            .select("id, slug, name_en, name_ar")
            .eq("id", product.category_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("product_reviews")
        .select("rating, comment, created_at")
        .eq("product_id", product.id!)
        .eq("is_approved", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("product_relations")
        .select("related_product_id")
        .eq("product_id", product.id!),
    ]);

  const relatedIds = (relations ?? []).map((r) => r.related_product_id);
  let related: ShopProduct[] = [];
  if (relatedIds.length > 0) {
    const { data: relatedProducts } = await supabase
      .from("products_storefront")
      .select("*")
      .in("id", relatedIds);
    related = await attachImagesToProducts(relatedProducts ?? []);
  }

  const reviewList = reviews ?? [];
  const averageRating =
    reviewList.length > 0
      ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length
      : null;

  return {
    ...card,
    description_en: product.description_en,
    description_ar: product.description_ar,
    dimensions: product.dimensions,
    material: product.material,
    color: product.color,
    package_contents_en: product.package_contents_en,
    package_contents_ar: product.package_contents_ar,
    video_url: product.video_url,
    category: category ?? null,
    reviews: reviewList,
    averageRating,
    reviewCount: reviewList.length,
    related,
  };
}
