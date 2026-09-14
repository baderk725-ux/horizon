import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";
import { routing } from "@/i18n/routing";

const STATIC_PATHS = ["", "/shop", "/categories", "/collections", "/faq", "/policies", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const supabase = await createClient();

  const [{ data: products }, { data: collections }, { data: categories }] = await Promise.all([
    supabase.from("products_storefront").select("slug, updated_at"),
    supabase.from("collections").select("slug, updated_at").eq("is_active", true),
    supabase.from("categories").select("slug"),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({ url: `${base}/${locale}${path}`, changeFrequency: "weekly" });
    }
    for (const product of products ?? []) {
      if (!product.slug) continue;
      entries.push({
        url: `${base}/${locale}/product/${product.slug}`,
        lastModified: product.updated_at ?? undefined,
        changeFrequency: "weekly",
      });
    }
    for (const collection of collections ?? []) {
      if (!collection.slug) continue;
      entries.push({
        url: `${base}/${locale}/collection/${collection.slug}`,
        lastModified: collection.updated_at ?? undefined,
        changeFrequency: "weekly",
      });
    }
    for (const category of categories ?? []) {
      entries.push({ url: `${base}/${locale}/shop?category=${category.slug}`, changeFrequency: "weekly" });
    }
  }

  return entries;
}
