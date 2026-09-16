"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { EditorialImage } from "@/components/EditorialImage";
import { Button } from "@/components/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const SHIPPING_OPTIONS = [
  { id: "standard", label: "Standard Shipping", detail: "5–7 business days", price: 0 },
  { id: "express", label: "Express Shipping", detail: "2–3 business days", price: 18 },
];

export function CheckoutClient() {
  const { lines, subtotal, clearCart } = useCart();
  const [shippingOption, setShippingOption] = useState(SHIPPING_OPTIONS[0].id);
  const [placed, setPlaced] = useState(false);

  const shippingCost = SHIPPING_OPTIONS.find((o) => o.id === shippingOption)?.price ?? 0;
  const total = subtotal + shippingCost;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPlaced(true);
    clearCart();
  }

  if (placed) {
    return (
      <div className="container-editorial flex flex-col items-center gap-6 py-24 text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-stone">Order Confirmed</span>
        <h1 className="font-serif text-4xl md:text-5xl">Thank you.</h1>
        <p className="max-w-md text-base leading-relaxed text-stone">
          Your order has been placed. A confirmation email is on its way — this is a demonstration
          checkout, so no payment has been processed.
        </p>
        <Button href="/shop" className="mt-4">
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-editorial flex flex-col items-center gap-6 py-24 text-center">
        <p className="text-stone">Your bag is empty — add something before checking out.</p>
        <Button href="/shop">Shop Collection</Button>
      </div>
    );
  }

  return (
    <div className="container-editorial py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Bag", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mt-6 font-serif text-4xl md:text-5xl">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-12">
          <section>
            <h2 className="font-serif text-xl">Contact</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Email" type="email" name="email" required />
              <Field label="Phone" type="tel" name="phone" />
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl">Shipping Address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="First Name" name="firstName" required />
              <Field label="Last Name" name="lastName" required />
              <Field label="Address" name="address" required className="sm:col-span-2" />
              <Field label="Apartment, suite, etc. (optional)" name="address2" className="sm:col-span-2" />
              <Field label="City" name="city" required />
              <Field label="State / Province" name="state" required />
              <Field label="ZIP / Postal Code" name="zip" required />
              <Field label="Country" name="country" required />
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl">Shipping Method</h2>
            <div className="mt-4 flex flex-col gap-3">
              {SHIPPING_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-between border px-4 py-4 transition-colors ${
                    shippingOption === option.id ? "border-charcoal" : "border-line"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={option.id}
                      checked={shippingOption === option.id}
                      onChange={() => setShippingOption(option.id)}
                      className="h-4 w-4 accent-charcoal"
                    />
                    <span>
                      <span className="block text-sm text-charcoal">{option.label}</span>
                      <span className="block text-xs text-stone">{option.detail}</span>
                    </span>
                  </span>
                  <span className="text-sm text-stone">
                    {option.price === 0 ? "Free" : formatPrice(option.price)}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl">Payment</h2>
            <p className="mt-2 text-xs text-stone">
              Demonstration checkout — no real payment is processed and no card details are stored.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Name on Card" name="cardName" required className="sm:col-span-2" />
              <Field label="Card Number" name="cardNumber" required className="sm:col-span-2" placeholder="0000 0000 0000 0000" />
              <Field label="Expiry" name="expiry" required placeholder="MM / YY" />
              <Field label="CVC" name="cvc" required />
            </div>
          </section>
        </div>

        <div className="h-fit border border-line p-6">
          <h2 className="font-serif text-xl">Order Summary</h2>
          <ul className="mt-6 flex flex-col gap-4">
            {lines.map((line) => (
              <li key={`${line.productId}-${line.variantId ?? "default"}`} className="flex gap-4">
                <div className="relative h-16 w-14 shrink-0 bg-cream">
                  <EditorialImage
                    icon={line.image.icon}
                    tone={line.image.tone}
                    url={line.image.url}
                    alt={line.image.alt}
                    className="h-full w-full"
                  />
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-[10px] text-ivory">
                    {line.quantity}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <span className="text-sm text-charcoal">{line.name}</span>
                  {line.variantLabel ? <span className="text-xs text-stone">{line.variantLabel}</span> : null}
                </div>
                <span className="text-sm text-stone">{formatPrice(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-stone">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone">Shipping</span>
              <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-serif text-lg">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Button type="submit" className="mt-6 w-full">
            Place Order
          </Button>
          <Link href="/cart" className="mt-4 block text-center text-xs uppercase tracking-[0.1em] text-stone underline underline-offset-4 hover:text-charcoal">
            Return to Bag
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  className = "",
  ...rest
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `field-${rest.name}`;
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-xs uppercase tracking-[0.1em] text-stone">
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className="border border-line bg-ivory px-4 py-3 text-sm text-charcoal focus:outline-none"
      />
    </div>
  );
}
