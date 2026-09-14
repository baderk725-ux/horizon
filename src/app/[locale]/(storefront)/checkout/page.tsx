import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { CheckoutForm } from "@/components/storefront/checkout-form";
import { getCart } from "@/lib/data/cart";
import { getCurrentUser } from "@/lib/data/auth";
import { getGovernoratesWithAreas } from "@/lib/data/checkout";

export default async function CheckoutPage() {
  const locale = await getLocale();
  const cart = await getCart();

  if (cart.lines.length === 0) {
    redirect({ href: "/cart", locale });
  }

  const t = await getTranslations("checkout");
  const [current, governorates] = await Promise.all([
    getCurrentUser(),
    getGovernoratesWithAreas(),
  ]);

  return (
    <Container className="max-w-5xl py-(--spacing-section)">
      <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <CheckoutForm
          governorates={governorates}
          defaultName={current?.profile?.full_name ?? undefined}
          defaultPhone={current?.profile?.phone ?? undefined}
          defaultEmail={current?.email ?? undefined}
        />

        <div className="h-fit rounded-(--radius-card) border border-brand-200 bg-paper p-6">
          <h2 className="font-display text-lg text-brand-900">{t("orderSummary")}</h2>
          <ul className="mt-4 space-y-2 text-sm text-brand-700">
            {cart.lines.map((line) => (
              <li key={line.cartItemId} className="flex justify-between gap-3">
                <span>
                  {locale === "ar" ? line.nameAr : line.nameEn} × {line.quantity}
                </span>
                <span className="whitespace-nowrap">{line.lineTotal.toFixed(2)} {t("currency")}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-brand-200 pt-4 text-sm">
            <span className="text-brand-600">{t("subtotal")}</span>
            <span className="font-medium text-brand-900">{cart.subtotal.toFixed(2)} {t("currency")}</span>
          </div>
          <p className="mt-2 text-xs text-brand-500">{t("shippingNote")}</p>
        </div>
      </div>
    </Container>
  );
}
