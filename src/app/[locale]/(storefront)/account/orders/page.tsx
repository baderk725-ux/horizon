import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { getCurrentUser } from "@/lib/data/auth";
import { getMyOrders, isReturnEligible } from "@/lib/data/orders";
import { ReturnRequestForm } from "@/components/storefront/return-request-form";

export default async function MyOrdersPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const session = await getCurrentUser();
  if (!session) {
    redirect({ href: "/sign-in", locale });
  }
  const current = session!;

  const t = await getTranslations("account");
  const orders = await getMyOrders(current.userId);
  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-JO", {
    dateStyle: "medium",
  });

  return (
    <Container className="max-w-2xl py-(--spacing-section)">
      <h1 className="font-display text-display-sm text-brand-900">{t("myOrders")}</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-brand-500">{t("noOrdersYet")}</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-(--radius-card) border border-brand-200 bg-paper p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg text-brand-900">{order.orderNumber}</p>
                  <p className="text-xs text-brand-500">{dateFormatter.format(new Date(order.createdAt))}</p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-medium text-brand-900">
                    {order.total.toFixed(2)} {t("currency")}
                  </p>
                  <p className="text-xs text-brand-500">{t(`orderStatus.${order.status}`)}</p>
                </div>
              </div>

              {order.returnStatus && (
                <p className="mt-2 text-xs text-brand-600">
                  {t("returnStatusLabel")}: {t(`returnStatus.${order.returnStatus}`)}
                </p>
              )}

              {isReturnEligible(order) && (
                <div className="mt-3">
                  <ReturnRequestForm orderId={order.id} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
