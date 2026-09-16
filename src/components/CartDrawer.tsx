"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { EditorialImage } from "./EditorialImage";
import { QuantitySelector } from "./QuantitySelector";
import { Button } from "./Button";

export function CartDrawer() {
  const { lines, isDrawerOpen, closeDrawer, removeItem, updateQuantity, subtotal } = useCart();

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, closeDrawer]);

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
    <>
      <div
        className={`fixed inset-0 z-50 bg-charcoal/40 transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-serif text-xl">Your Bag ({detailedLines.length})</h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center text-charcoal hover:text-stone"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {detailedLines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-stone">Your bag is empty.</p>
              <Button href="/shop" variant="secondary" onClick={closeDrawer}>
                Shop Collection
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {detailedLines.map(({ line, product, variant, price }) => (
                <li key={`${line.productId}-${line.variantId ?? "default"}`} className="flex gap-4 py-6">
                  <Link href={`/product/${product.slug}`} onClick={closeDrawer} className="h-24 w-20 shrink-0 bg-cream">
                    <EditorialImage
                      icon={product.images[0].icon}
                      tone={product.images[0].tone}
                      alt={product.images[0].alt}
                      className="h-full w-full"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/product/${product.slug}`} onClick={closeDrawer} className="font-serif text-base leading-snug hover:text-espresso">
                        {product.name}
                      </Link>
                      <span className="whitespace-nowrap text-sm text-stone">{formatPrice(price, product.currency)}</span>
                    </div>
                    {variant ? <span className="text-xs text-stone">{variant.label}</span> : null}
                    <div className="mt-2 flex items-center justify-between">
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
          )}
        </div>

        {detailedLines.length > 0 ? (
          <div className="border-t border-line px-6 py-6">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-stone">Subtotal</span>
              <span className="font-serif text-lg">{formatPrice(subtotal)}</span>
            </div>
            <p className="mb-4 text-xs text-stone">Shipping and taxes calculated at checkout.</p>
            <div className="flex flex-col gap-3">
              <Button href="/checkout" onClick={closeDrawer} className="w-full">
                Checkout
              </Button>
              <Button href="/cart" variant="secondary" onClick={closeDrawer} className="w-full">
                View Bag
              </Button>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
}
