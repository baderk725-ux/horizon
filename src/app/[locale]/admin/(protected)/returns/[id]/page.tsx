import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAdminReturnById } from "@/lib/data/admin/returns";
import { ReturnStatusBadge } from "@/components/admin/return-status-badge";
import { ReturnStatusActions } from "@/components/admin/return-status-actions";
import type { ReturnStatus } from "@/lib/returns/status";

export default async function AdminReturnDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const ret = await getAdminReturnById(id);
  if (!ret) notFound();

  const t = await getTranslations("adminReturns");
  const tOrders = await getTranslations("adminOrders");
  const locale = await getLocale();
  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-JO", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm text-brand-900">
            {t("returnFor")} {ret.order?.order_number ?? "—"}
          </h1>
          <p className="mt-1 text-sm text-brand-500">{dateFormatter.format(new Date(ret.created_at))}</p>
        </div>
        <ReturnStatusBadge status={ret.status as ReturnStatus} label={t(`status.${ret.status}`)} />
      </div>

      <ReturnStatusActions returnId={ret.id} currentStatus={ret.status as ReturnStatus} />

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
          <h2 className="font-display text-lg text-brand-900">{t("returnDetails")}</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-500">{t("reason")}</dt>
              <dd className="text-brand-900">{t(`reasonLabels.${ret.reason}`)}</dd>
            </div>
            {ret.reason_notes && (
              <div className="pt-1">
                <dt className="text-brand-500">{t("reasonNotes")}</dt>
                <dd className="mt-0.5 text-brand-900">{ret.reason_notes}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
          <h2 className="font-display text-lg text-brand-900">{tOrders("customer")}</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-500">{tOrders("name")}</dt>
              <dd className="text-brand-900">{ret.order?.customer?.full_name ?? ret.order?.guest_name ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-500">{tOrders("phone")}</dt>
              <dd className="text-brand-900">{ret.order?.customer?.phone ?? ret.order?.guest_phone ?? "—"}</dd>
            </div>
          </dl>
          {ret.order && (
            <Link
              href={`/admin/orders/${ret.order.id}`}
              className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline"
            >
              {t("viewOrder")}
            </Link>
          )}
        </section>
      </div>

      {ret.order && (
        <section className="rounded-(--radius-card) border border-brand-200 bg-paper">
          <h2 className="p-6 pb-0 font-display text-lg text-brand-900">{tOrders("items")}</h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-y border-brand-200 text-xs uppercase tracking-wider text-brand-500">
                <th className="px-6 py-3 text-start">{tOrders("product")}</th>
                <th className="px-6 py-3 text-start">{tOrders("quantity")}</th>
                <th className="px-6 py-3 text-start">{tOrders("unitPrice")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {ret.order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-3 text-brand-900">
                    {locale === "ar" ? item.product_name_ar : item.product_name_en}
                  </td>
                  <td className="px-6 py-3 text-brand-700">{item.quantity}</td>
                  <td className="px-6 py-3 text-brand-700">
                    {item.unit_price.toFixed(2)} {tOrders("currency")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-brand-200 p-6 text-sm">
            <div className="flex justify-between font-medium">
              <span className="text-brand-900">{tOrders("total")}</span>
              <span className="text-brand-900">
                {ret.order.total.toFixed(2)} {tOrders("currency")}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
