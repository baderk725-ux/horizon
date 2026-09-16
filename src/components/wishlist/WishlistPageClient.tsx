"use client";

import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/ProductGrid";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";

export function WishlistPageClient({ allProducts }: { allProducts: Product[] }) {
  const { productIds } = useWishlist();
  const savedProducts = allProducts.filter((p) => productIds.includes(p.id));

  return (
    <div className="container-editorial py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="mt-6 font-serif text-4xl md:text-5xl">Your Wishlist</h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-stone">
        Pieces you&rsquo;ve saved to consider later. Saved on this device only.
      </p>

      {savedProducts.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-6 py-16 text-center">
          <p className="text-stone">You haven&rsquo;t saved anything yet.</p>
          <Button href="/shop">Shop Collection</Button>
        </div>
      ) : (
        <div className="mt-10">
          <ProductGrid products={savedProducts} />
        </div>
      )}
    </div>
  );
}
