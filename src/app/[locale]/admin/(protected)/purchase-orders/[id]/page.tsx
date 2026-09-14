import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAdminPurchaseOrderById } from "@/lib/data/admin/purchase-orders";
import { getAdminSuppliers } from "@/lib/data/admin/suppliers";
import { PurchaseOrderForm } from "@/components/admin/purchase-order-form";
import { POStatusActions } from "@/components/admin/po-status-actions";
import type { PurchaseOrderStatus } from "@/lib/purchase-orders/status";

export default async function AdminPurchaseOrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const po = await getAdminPurchaseOrderById(id);
  if (!po) notFound();

  const t = await getTranslations("adminPurchaseOrders");
  const tOrders = await getTranslations("adminOrders");
  const locale = await getLocale();
  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-JO", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const totalCost = po.items.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm text-brand-900">{po.po_number}</h1>
          <p className="mt-1 text-sm text-brand-500">{dateFormatter.format(new Date(po.created_at))}</p>
        </div>
        <span
          className={`rounded-(--radius-pill) px-3 py-1 text-xs font-medium ${
            po.status === "received"
              ? "bg-green-100 text-green-800"
              : po.status === "cancelled"
                ? "bg-brand-200 text-brand-700"
                : po.status === "ordered"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-amber-100 text-amber-800"
          }`}
        >
          {t(`status.${po.status}`)}
        </span>
      </div>

      <POStatusActions id={po.id} currentStatus={po.status as PurchaseOrderStatus} />

      {po.status === "draft" ? (
        <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
          <PurchaseOrderForm suppliers={await getAdminSuppliers()} purchaseOrder={po} />
        </section>
      ) : (
        <>
          <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
            <h2 className="font-display text-lg text-brand-900">{t("supplier")}</h2>
            <p className="mt-2 text-sm text-brand-700">{po.supplier?.name ?? t("noSupplier")}</p>
            {po.notes && <p className="mt-2 text-sm text-brand-600">{po.notes}</p>}
          </section>

          <section className="rounded-(--radius-card) border border-brand-200 bg-paper">
            <h2 className="p-6 pb-0 font-display text-lg text-brand-900">{t("items")}</h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-y border-brand-200 text-xs uppercase tracking-wider text-brand-500">
                  <th className="px-6 py-3 text-start">{tOrders("product")}</th>
                  <th className="px-6 py-3 text-start">{tOrders("quantity")}</th>
                  <th className="px-6 py-3 text-start">{t("unitCost")}</th>
                  <th className="px-6 py-3 text-start">{t("lineTotal")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-200">
                {po.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-3 text-brand-900">
                      {locale === "ar" ? item.nameAr : item.nameEn}
                    </td>
                    <td className="px-6 py-3 text-brand-700">{item.quantity}</td>
                    <td className="px-6 py-3 text-brand-700">
                      {item.unitCost.toFixed(2)} {tOrders("currency")}
                    </td>
                    <td className="px-6 py-3 text-brand-900">
                      {(item.unitCost * item.quantity).toFixed(2)} {tOrders("currency")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between border-t border-brand-200 p-6 text-sm font-medium">
              <span className="text-brand-900">{t("totalCost")}</span>
              <span className="text-brand-900">
                {totalCost.toFixed(2)} {tOrders("currency")}
              </span>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
