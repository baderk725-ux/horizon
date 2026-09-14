import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getAdminPurchaseOrders,
  PURCHASE_ORDER_STATUSES,
  type PurchaseOrderStatus,
} from "@/lib/data/admin/purchase-orders";

export default async function AdminPurchaseOrdersPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("adminPurchaseOrders");
  const locale = await getLocale();

  const status = (PURCHASE_ORDER_STATUSES as string[]).includes(searchParams.status ?? "")
    ? (searchParams.status as PurchaseOrderStatus)
    : undefined;

  const purchaseOrders = await getAdminPurchaseOrders({ status });

  const tabs: { key: PurchaseOrderStatus | "all"; label: string }[] = [
    { key: "all", label: t("all") },
    ...PURCHASE_ORDER_STATUSES.map((s) => ({ key: s, label: t(`status.${s}`) })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
          <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
        </div>
        <Link
          href="/admin/purchase-orders/new"
          className="rounded-(--radius-button) bg-brand-900 px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-paper hover:bg-brand-800"
        >
          {t("newPurchaseOrder")}
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const href = `/${locale}/admin/purchase-orders${tab.key !== "all" ? `?status=${tab.key}` : ""}`;
          const active = tab.key === "all" ? !status : status === tab.key;
          return (
            <a
              key={tab.key}
              href={href}
              className={`rounded-(--radius-pill) px-4 py-1.5 text-xs font-medium uppercase tracking-wider ${
                active ? "bg-brand-900 text-paper" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>

      {purchaseOrders.length === 0 ? (
        <p className="text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="px-5 py-3 text-start">{t("poNumber")}</th>
                <th className="px-5 py-3 text-start">{t("supplier")}</th>
                <th className="px-5 py-3 text-start">{t("items")}</th>
                <th className="px-5 py-3 text-start">{t("status.label")}</th>
                <th className="px-5 py-3 text-start">{t("created")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {purchaseOrders.map((po) => (
                <tr key={po.id}>
                  <td className="px-5 py-3">
                    <Link href={`/admin/purchase-orders/${po.id}`} className="font-medium text-brand-900 hover:underline">
                      {po.po_number}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-brand-700">{po.supplier?.name ?? t("noSupplier")}</td>
                  <td className="px-5 py-3 text-brand-700">{po.itemCount}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-(--radius-pill) px-2.5 py-0.5 text-xs ${
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
                  </td>
                  <td className="px-5 py-3 text-brand-500">
                    {new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-JO", {
                      dateStyle: "medium",
                    }).format(new Date(po.created_at))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
