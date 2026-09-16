import { createClient } from "./supabase/server";
import type { Product, ProductImage, ProductVariant, CategorySlug } from "./types";

const PRODUCT_SELECT = `
  *,
  category:categories(slug),
  product_images(id, url, alt, placeholder_icon, placeholder_tone, sort_order),
  product_variants(id, label, swatch, price_modifier, in_stock, sort_order)
`;

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  category: { slug: string } | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  short_description: string;
  description: string;
  materials: string[];
  dimensions: string;
  care: string[];
  shipping: string;
  badge: string | null;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_featured: boolean;
  is_published: boolean;
  in_stock: boolean;
  review_rating: number | null;
  review_count: number | null;
  seo_title: string | null;
  seo_description: string | null;
  product_images: {
    id: string;
    url: string | null;
    alt: string;
    placeholder_icon: string;
    placeholder_tone: string;
    sort_order: number;
  }[];
  product_variants: {
    id: string;
    label: string;
    swatch: string | null;
    price_modifier: number;
    in_stock: boolean;
    sort_order: number;
  }[];
}

function mapProduct(row: ProductRow): Product {
  const images: ProductImage[] =
    row.product_images.length > 0
      ? [...row.product_images]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            icon: img.placeholder_icon as ProductImage["icon"],
            tone: img.placeholder_tone as ProductImage["tone"],
          }))
      : [{ alt: row.name, icon: "home-decor", tone: "sand" }];

  const variants: ProductVariant[] | undefined = row.product_variants.length
    ? [...row.product_variants]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((v) => ({
          id: v.id,
          label: v.label,
          swatch: v.swatch,
          priceModifier: v.price_modifier,
          inStock: v.in_stock,
        }))
    : undefined;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: (row.category?.slug ?? "") as CategorySlug,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : null,
    currency: row.currency,
    shortDescription: row.short_description,
    description: row.description,
    images,
    variants,
    materials: row.materials,
    dimensions: row.dimensions,
    care: row.care,
    shipping: row.shipping,
    badge: row.badge as Product["badge"],
    isNewArrival: row.is_new_arrival,
    isBestSeller: row.is_best_seller,
    isFeatured: row.is_featured,
    isPublished: row.is_published,
    inStock: row.in_stock,
    review:
      row.review_rating != null && row.review_count != null
        ? { rating: Number(row.review_rating), count: row.review_count }
        : undefined,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as unknown as ProductRow[]).map(mapProduct);
}

export async function getProductByIdForAdmin(id: string): Promise<Product | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return undefined;
  const product = mapProduct(data as unknown as ProductRow);
  // Admin edit view needs the real (possibly empty) image list and category id,
  // unlike the storefront-facing mapper which synthesizes a placeholder image.
  const row = data as unknown as ProductRow;
  product.images = row.product_images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
    icon: img.placeholder_icon as ProductImage["icon"],
    tone: img.placeholder_tone as ProductImage["tone"],
  }));
  product.categoryId = row.category_id ?? undefined;
  return product;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data as unknown as ProductRow) : undefined;
}

export async function getProductsByCategory(categorySlug: CategorySlug): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.category === categorySlug);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.isBestSeller).slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.isNewArrival).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}
