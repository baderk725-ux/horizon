import type { Metadata } from "next";
import { WishlistPageClient } from "@/components/wishlist/WishlistPageClient";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Products you've saved from the NOVEL collection.",
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
