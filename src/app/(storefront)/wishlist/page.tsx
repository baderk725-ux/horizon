import type { Metadata } from "next";
import { WishlistPageClient } from "@/components/wishlist/WishlistPageClient";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Products you've saved from the NOVEL collection.",
};

export default async function WishlistPage() {
  const products = await getProducts();
  return <WishlistPageClient allProducts={products} />;
}
