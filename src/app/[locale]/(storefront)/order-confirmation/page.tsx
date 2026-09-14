import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { getVerifiedOrderTotals } from "@/lib/data/orders";

export default async function OrderConfirmationPage(props: {
  searchParams: Promise<{
    number?: string;
    total?: string;
    subtotal?: string;
    delivery?: string;
    items?: string;
  }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const searchParams = await props.searchParams;

  if (!searchParams.number) {
    redirect({ href: "/", locale });
  }

  const t = await getTranslations("checkout");

  // For a signed-in customer, prefer real DB totals over the URL's values —
  // closes the "hand-edit the query string" spoofing gap for the common
  // case. Guest checkouts have no session to verify ownership against, so
  // they fall back to the values create_order returned at redirect time
  // (server-authoritative at generation, just not re-verified on reload).
  const verified = await getVerifiedOrderTotals(searchParams.number!);
  const display = verified
    ? {
        number: verified.orderNumber,
        subtotal: verified.subtotal.toFixed(2),
        delivery: verified.deliveryFee.toFixed(2),
        total: verified.total.toFixed(2),
      }
    : {
        number: searchParams.number,
        subtotal: searchParams.subtotal,
        delivery: searchParams.delivery,
        total: searchParams.total,
      };

  return (
    <Container className="max-w-xl py-(--spacing-section) text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-accent-600">
        {t("thankYou")}
      </p>
      <h1 className="mt-2 font-display text-display-sm text-brand-900">
        {t("orderConfirmed")}
      </h1>
      <p className="mt-4 text-sm text-brand-600">{t("confirmationNotice")}</p>

      <div className="mt-8 rounded-(--radius-card) border border-brand-200 bg-paper p-6 text-start">
        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-600">{t("orderNumber")}</span>
          <span className="font-medium text-brand-900">{display.number}</span>
        </div>
        {display.subtotal && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-brand-600">{t("subtotal")}</span>
            <span className="text-brand-900">{display.subtotal} {t("currency")}</span>
          </div>
        )}
        {display.delivery && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-brand-600">{t("delivery")}</span>
            <span className="text-brand-900">{display.delivery} {t("currency")}</span>
          </div>
        )}
        {display.total && (
          <div className="mt-3 flex items-center justify-between border-t border-brand-200 pt-3 text-base">
            <span className="font-medium text-brand-900">{t("total")}</span>
            <span className="font-medium text-brand-900">{display.total} {t("currency")}</span>
          </div>
        )}
      </div>

      <ButtonLink href="/shop" variant="secondary" className="mt-8">
        {t("continueShopping")}
      </ButtonLink>
    </Container>
  );
}
