"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { EditorialImage } from "./EditorialImage";
import { WishlistButton } from "./WishlistButton";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const secondImage = product.images[1] ?? product.images[0];

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-cream">
        <div className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-0" : "opacity-100"}`}>
          <EditorialImage
            icon={product.images[0].icon}
            tone={product.images[0].tone}
            url={product.images[0].url}
            alt={product.images[0].alt}
            className="h-full w-full"
          />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <EditorialImage
            icon={secondImage.icon}
            tone={secondImage.tone}
            url={secondImage.url}
            alt={secondImage.alt}
            className="h-full w-full"
          />
        </div>

        {product.badge ? (
          <span className="absolute left-3 top-3 bg-ivory/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-charcoal">
            {product.badge}
          </span>
        ) : null}

        <WishlistButton productId={product.id} className="absolute right-3 top-3" />

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const variant = product.variants?.[0];
            addItem(
              {
                productId: product.id,
                variantId: variant?.id,
                variantLabel: variant?.label,
                name: product.name,
                slug: product.slug,
                price: product.price + (variant?.priceModifier ?? 0),
                currency: product.currency,
                image: product.images[0],
              },
              1
            );
          }}
          className={`absolute inset-x-3 bottom-3 bg-charcoal py-3 text-xs uppercase tracking-[0.14em] text-ivory transition-all duration-300 hover:bg-espresso ${
            hovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          Quick Add
        </button>
      </Link>

      <div className="mt-4 flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.1em] text-stone">
          {product.category.replace("-", " ")}
        </span>
        <Link
          href={`/product/${product.slug}`}
          className="font-serif text-lg leading-snug text-charcoal hover:text-espresso"
        >
          {product.name}
        </Link>
        <span className="text-sm text-stone">{formatPrice(product.price, product.currency)}</span>
      </div>
    </div>
  );
}
