import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAdminOrderById } from "@/lib/data/admin/orders";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { OrderStatusActions } from "@/components/admin/order-status-actions";
import { OrderInternalNotes } from "@/components/admin/order-internal-notes";

export default async function AdminOrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();

  const t = await getTranslations("adminOrders");
  const locale = await getLocale();
  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-JO", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm text-brand-900">{order.order_number}</h1>
          <p className="mt-1 text-sm text-brand-500">{dateFormatter.format(new Date(order.created_at))}</p>
          {order.order_source === "manual" && (
            <p className="mt-1 text-xs text-brand-500">
              {t("source")}: {t("sourceManual")}
              {order.createdByAdmin?.full_name && ` · ${t("createdBy")} ${order.createdByAdmin.full_name}`}
            </p>
          )}
        </div>
        <OrderStatusBadge status={order.status} label={t(`status.${order.status}`)} />
      </div>

      <OrderStatusActions orderId={order.id} currentStatus={order.status} />

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
          <h2 className="font-display text-lg text-brand-900">{t("customer")}</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-500">{t("name")}</dt>
              <dd className="text-brand-900">{order.customer?.full_name ?? order.guest_name ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-500">{t("phone")}</dt>
              <dd className="text-brand-900">{order.customer?.phone ?? order.guest_phone ?? "—"}</dd>
            </div>
            {(order.customer?.email ?? order.guest_email) && (
              <div className="flex justify-between">
                <dt className="text-brand-500">{t("email")}</dt>
                <dd className="text-brand-900">{order.customer?.email ?? order.guest_email}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
          <h2 className="font-display text-lg text-brand-900">{t("delivery")}</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-500">{t("governorate")}</dt>
              <dd className="text-brand-900">
                {order.governorate ? (locale === "ar" ? order.governorate.name_ar : order.governorate.name_en) : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-500">{t("area")}</dt>
              <dd className="text-brand-900">
                {order.area ? (locale === "ar" ? order.area.name_ar : order.area.name_en) : "—"}
              </dd>
            </div>
            <div className="pt-1">
              <dt className="text-brand-500">{t("address")}</dt>
              <dd className="mt-0.5 text-brand-900">{order.full_address}</dd>
            </div>
            {order.tracking_number && (
              <div className="flex justify-between pt-1">
                <dt className="text-brand-500">{t("trackingNumber")}</dt>
                <dd className="text-brand-900">{order.tracking_number}</dd>
              </div>
            )}
          </dl>
        </section>
      </div>

      <section className="rounded-(--radius-card) border border-brand-200 bg-paper">
        <h2 className="p-6 pb-0 font-display text-lg text-brand-900">{t("items")}</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-y border-brand-200 text-xs uppercase tracking-wider text-brand-500">
              <th className="px-6 py-3 text-start">{t("product")}</th>
              <th className="px-6 py-3 text-start">{t("quantity")}</th>
              <th className="px-6 py-3 text-start">{t("unitPrice")}</th>
              <th className="px-6 py-3 text-start">{t("lineTotal")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-200">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-3 text-brand-900">
                  {locale === "ar" ? item.product_name_ar : item.product_name_en}
                </td>
                <td className="px-6 py-3 text-brand-700">{item.quantity}</td>
                <td className="px-6 py-3 text-brand-700">{item.unit_price.toFixed(2)} {t("currency")}</td>
                <td className="px-6 py-3 text-brand-900">
                  {(item.unit_price * item.quantity).toFixed(2)} {t("currency")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="space-y-1.5 border-t border-brand-200 p-6 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-500">{t("subtotal")}</span>
            <span className="text-brand-900">{order.subtotal.toFixed(2)} {t("currency")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-500">{t("deliveryFee")}</span>
            <span className="text-brand-900">{order.delivery_fee.toFixed(2)} {t("currency")}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between">
              <span className="text-brand-500">
                {t("discount")} {order.coupon_code && `(${order.coupon_code})`}
              </span>
              <span className="text-brand-900">-{order.discount_amount.toFixed(2)} {t("currency")}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-brand-200 pt-2 text-base font-medium">
            <span className="text-brand-900">{t("total")}</span>
            <span className="text-brand-900">{order.total.toFixed(2)} {t("currency")}</span>
          </div>
        </div>
      </section>

      {order.notes && (
        <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
          <h2 className="font-display text-lg text-brand-900">{t("customerNotes")}</h2>
          <p className="mt-2 text-sm text-brand-700">{order.notes}</p>
        </section>
      )}

      <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <OrderInternalNotes orderId={order.id} initialNotes={order.internal_notes} />
      </section>

      <section>
        <h2 className="font-display text-lg text-brand-900">{t("timeline")}</h2>
        {order.timeline.length === 0 ? (
          <p className="mt-3 text-sm text-brand-500">{t("noActivity")}</p>
        ) : (
          <ol className="mt-4 space-y-3 border-s-2 border-brand-200 ps-5">
            {order.timeline.map((entry) => (
              <li key={entry.id} className="text-sm">
                <p className="text-brand-900">{entry.description ?? entry.action}</p>
                <p className="text-xs text-brand-500">
                  {entry.admin_name ?? t("system")} · {dateFormatter.format(new Date(entry.created_at))}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
