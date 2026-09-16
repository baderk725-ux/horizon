"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { EditorialImage } from "@/components/EditorialImage";
import { QuantitySelector } from "@/components/QuantitySelector";
import { Button } from "@/components/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function CartPageClient() {
  const { lines, removeItem, updateQuantity, subtotal } = useCart();

  const detailedLines = lines
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return null;
      const variant = product.variants?.find((v) => v.id === line.variantId);
      const price = product.price + (variant?.priceModifier ?? 0);
      return { line, product, variant, price };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <div className="container-editorial py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shopping Bag" }]} />
      <h1 className="mt-6 font-serif text-4xl md:text-5xl">Your Bag</h1>

      {detailedLines.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-6 py-16 text-center">
          <p className="text-stone">Your bag is currently empty.</p>
          <Button href="/shop">Shop Collection</Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y divide-line border-y border-line">
            {detailedLines.map(({ line, product, variant, price }) => (
              <li key={`${line.productId}-${line.variantId ?? "default"}`} className="flex gap-6 py-8">
                <Link href={`/product/${product.slug}`} className="h-32 w-28 shrink-0 bg-cream">
                  <EditorialImage
                    icon={product.images[0].icon}
                    tone={product.images[0].tone}
                    alt={product.images[0].alt}
                    className="h-full w-full"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link href={`/product/${product.slug}`} className="font-serif text-xl hover:text-espresso">
                        {product.name}
                      </Link>
                      {variant ? <p className="mt-1 text-sm text-stone">{variant.label}</p> : null}
                    </div>
                    <span className="whitespace-nowrap font-serif text-lg">
                      {formatPrice(price * line.quantity, product.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <QuantitySelector
                      quantity={line.quantity}
                      onChange={(q) => updateQuantity(line.productId, line.variantId, q)}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(line.productId, line.variantId)}
                      className="text-xs uppercase tracking-[0.1em] text-stone underline underline-offset-4 hover:text-charcoal"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="h-fit border border-line p-6">
            <h2 className="font-serif text-xl">Order Summary</h2>
            <div className="mt-6 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Shipping</span>
                <span className="text-stone">Calculated at checkout</span>
              </div>
            </div>
            <div className="mt-6 flex justify-between border-t border-line pt-4 font-serif text-lg">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Button href="/checkout" className="mt-6 w-full">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
