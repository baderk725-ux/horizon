import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

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
          <span className="font-medium text-brand-900">{searchParams.number}</span>
        </div>
        {searchParams.subtotal && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-brand-600">{t("subtotal")}</span>
            <span className="text-brand-900">{searchParams.subtotal} {t("currency")}</span>
          </div>
        )}
        {searchParams.delivery && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-brand-600">{t("delivery")}</span>
            <span className="text-brand-900">{searchParams.delivery} {t("currency")}</span>
          </div>
        )}
        {searchParams.total && (
          <div className="mt-3 flex items-center justify-between border-t border-brand-200 pt-3 text-base">
            <span className="font-medium text-brand-900">{t("total")}</span>
            <span className="font-medium text-brand-900">{searchParams.total} {t("currency")}</span>
          </div>
        )}
      </div>

      <ButtonLink href="/shop" variant="secondary" className="mt-8">
        {t("continueShopping")}
      </ButtonLink>
    </Container>
  );
}
