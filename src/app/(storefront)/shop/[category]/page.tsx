import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShopClient } from "@/components/shop/ShopClient";
import { getCategory, getCategories } from "@/lib/categories";
import { getProductsByCategory, getBestSellers, getNewArrivals } from "@/lib/products";
import type { CategorySlug } from "@/lib/types";

const VIRTUAL_CATEGORIES: Record<string, { name: string; description: string }> = {
  "new-arrivals": {
    name: "New Arrivals",
    description: "The newest additions to the NOVEL collection, in from our makers this season.",
  },
  "best-sellers": {
    name: "Best Sellers",
    description: "The pieces our customers return for, again and again.",
  },
};

async function resolve(categorySlug: string) {
  if (categorySlug === "new-arrivals") {
    return {
      name: VIRTUAL_CATEGORIES["new-arrivals"].name,
      description: VIRTUAL_CATEGORIES["new-arrivals"].description,
      products: await getNewArrivals(100),
    };
  }
  if (categorySlug === "best-sellers") {
    return {
      name: VIRTUAL_CATEGORIES["best-sellers"].name,
      description: VIRTUAL_CATEGORIES["best-sellers"].description,
      products: await getBestSellers(100),
    };
  }
  const category = await getCategory(categorySlug);
  if (!category) return null;
  return {
    name: category.name,
    description: category.description,
    products: await getProductsByCategory(category.slug),
    slug: category.slug,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const resolved = await resolve(category);
  if (!resolved) return {};
  return {
    title: resolved.name,
    description: resolved.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const [resolved, allCategories] = await Promise.all([resolve(category), getCategories()]);
  if (!resolved) notFound();

  const lockedCategory = "slug" in resolved ? (resolved.slug as CategorySlug) : undefined;

  return (
    <div className="container-editorial py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: resolved.name }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-serif text-4xl md:text-5xl">{resolved.name}</h1>
        <p className="mt-4 text-base leading-relaxed text-stone">{resolved.description}</p>
      </div>
      <div className="mt-10">
        <ShopClient products={resolved.products} categories={allCategories} lockedCategory={lockedCategory} />
      </div>
    </div>
  );
}
