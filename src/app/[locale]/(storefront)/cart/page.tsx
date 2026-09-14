import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { CartLineControls } from "@/components/storefront/cart-line-controls";
import { getCart } from "@/lib/data/cart";

export default async function CartPage() {
  const t = await getTranslations("cart");
  const locale = await getLocale();
  const cart = await getCart();

  return (
    <Container className="max-w-4xl py-(--spacing-section)">
      <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>

      {cart.lines.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-sm text-brand-500">{t("empty")}</p>
          <ButtonLink href="/shop" variant="secondary" className="mt-6">
            {t("continueShopping")}
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <ul className="divide-y divide-brand-200 rounded-(--radius-card) border border-brand-200 bg-paper">
            {cart.lines.map((line) => {
              const name = locale === "ar" ? line.nameAr : line.nameEn;
              return (
                <li key={line.cartItemId} className="flex gap-4 p-5">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-(--radius-card) bg-brand-100">
                    {line.image && (
                      <Image src={line.image} alt={name} fill sizes="96px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <Link href={`/product/${line.slug}`} className="font-display text-lg text-brand-900 hover:text-accent-600">
                        {name}
                      </Link>
                      <p className="whitespace-nowrap text-sm font-medium text-brand-900">
                        {line.lineTotal.toFixed(2)} {t("currency")}
                      </p>
                    </div>
                    <p className="text-xs text-brand-500">
                      {line.unitPrice.toFixed(2)} {t("currency")} {t("each")}
                    </p>
                    <div className="mt-2">
                      <CartLineControls
                        cartItemId={line.cartItemId}
                        quantity={line.quantity}
                        maxQuantity={line.availableStock}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="h-fit rounded-(--radius-card) border border-brand-200 bg-paper p-6">
            <div className="flex items-center justify-between text-sm text-brand-600">
              <span>{t("subtotal")}</span>
              <span className="font-medium text-brand-900">
                {cart.subtotal.toFixed(2)} {t("currency")}
              </span>
            </div>
            <p className="mt-2 text-xs text-brand-500">{t("shippingCalculatedAtCheckout")}</p>
            <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
              {t("checkout")}
            </ButtonLink>
          </div>
        </div>
      )}
    </Container>
  );
}
