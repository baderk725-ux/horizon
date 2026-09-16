"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { QuantitySelector } from "@/components/QuantitySelector";
import { WishlistButton } from "@/components/WishlistButton";
import { Button } from "@/components/Button";
import { useCart } from "@/context/CartContext";

export function ProductInfo({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = product.variants?.find((v) => v.id === variantId);
  const price = product.price + (variant?.priceModifier ?? 0);
  const outOfStock = variant ? !variant.inStock : !product.inStock;

  const stars = useMemo(() => {
    if (!product.review) return null;
    return Math.round(product.review.rating);
  }, [product.review]);

  function handleAddToCart() {
    addItem(
      {
        productId: product.id,
        variantId: variant?.id,
        variantLabel: variant?.label,
        name: product.name,
        slug: product.slug,
        price,
        currency: product.currency,
        image: product.images[0],
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs uppercase tracking-[0.14em] text-stone">
          {product.category.replace("-", " ")}
        </span>
        <h1 className="mt-2 font-serif text-3xl leading-tight md:text-4xl">{product.name}</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-serif text-2xl">{formatPrice(price, product.currency)}</span>
        {product.compareAtPrice ? (
          <span className="text-sm text-stone line-through">
            {formatPrice(product.compareAtPrice, product.currency)}
          </span>
        ) : null}
      </div>

      {product.review && stars !== null ? (
        <div className="flex items-center gap-2 text-sm text-stone">
          <div className="flex" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                viewBox="0 0 20 20"
                className={`h-4 w-4 ${i < stars ? "fill-charcoal" : "fill-line"}`}
              >
                <path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L10 15l-5.6 3 1.4-6.2L1 7.5l6.4-.6L10 1z" />
              </svg>
            ))}
          </div>
          <span>
            {product.review.rating.toFixed(1)} ({product.review.count} reviews)
          </span>
        </div>
      ) : null}

      <p className="max-w-md text-base leading-relaxed text-stone">{product.shortDescription}</p>

      {product.variants ? (
        <div>
          <span className="text-xs uppercase tracking-[0.14em] text-stone">
            {product.variants[0].swatch ? "Color" : "Size"}: <span className="text-charcoal">{variant?.label}</span>
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={!v.inStock}
                onClick={() => setVariantId(v.id)}
                aria-pressed={v.id === variantId}
                title={v.inStock ? v.label : `${v.label} — out of stock`}
                className={`flex items-center gap-2 border px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  v.id === variantId ? "border-charcoal bg-charcoal text-ivory" : "border-line hover:border-charcoal"
                }`}
              >
                {v.swatch ? (
                  <span
                    className="h-3 w-3 rounded-full border border-line"
                    style={{ backgroundColor: v.swatch }}
                    aria-hidden="true"
                  />
                ) : null}
                {v.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
        <QuantitySelector quantity={quantity} onChange={setQuantity} />
        <div className="flex flex-1 items-center gap-3">
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            {outOfStock ? "Out of Stock" : added ? "Added ✓" : "Add to Cart"}
          </Button>
          <WishlistButton productId={product.id} className="border border-line bg-transparent hover:bg-cream" />
        </div>
      </div>

      <Button variant="secondary" href="/checkout" className="w-full sm:w-auto">
        Buy Now
      </Button>
    </div>
  );
}
