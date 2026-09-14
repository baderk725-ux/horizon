import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { getAdminOrders, ORDER_STATUSES, type OrderStatus } from "@/lib/data/admin/orders";

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("adminOrders");
  const locale = await getLocale();

  const status = (ORDER_STATUSES as string[]).includes(searchParams.status ?? "")
    ? (searchParams.status as OrderStatus)
    : undefined;

  const { orders, total, page, pageCount } = await getAdminOrders({
    status,
    search: searchParams.q,
    page: searchParams.page ? Number(searchParams.page) : 1,
  });

  const tabs: { key: OrderStatus | "all"; label: string }[] = [
    { key: "all", label: t("allOrders") },
    ...ORDER_STATUSES.filter((s) => s !== "returned").map((s) => ({
      key: s,
      label: t(`status.${s}`),
    })),
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const params = new URLSearchParams();
          if (tab.key !== "all") params.set("status", tab.key);
          if (searchParams.q) params.set("q", searchParams.q);
          const href = `/${locale}/admin/orders${params.toString() ? `?${params}` : ""}`;
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

      <form className="max-w-sm">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          type="search"
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder={t("search")}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-2.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </form>

      <p className="text-sm text-brand-500">{t("resultCount", { count: total })}</p>

      {orders.length === 0 ? (
        <p className="text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="px-5 py-3 text-start">{t("orderNumber")}</th>
                <th className="px-5 py-3 text-start">{t("customer")}</th>
                <th className="px-5 py-3 text-start">{t("total")}</th>
                <th className="px-5 py-3 text-start">{t("status.label")}</th>
                <th className="px-5 py-3 text-start">{t("date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-900 hover:underline">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-brand-700">
                    {order.customer?.full_name ?? order.guest_name ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-brand-700">{order.total.toFixed(2)} {t("currency")}</td>
                  <td className="px-5 py-3">
                    <OrderStatusBadge status={order.status} label={t(`status.${order.status}`)} />
                  </td>
                  <td className="px-5 py-3 text-brand-500">
                    {new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-JO", {
                      dateStyle: "medium",
                    }).format(new Date(order.created_at))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageCount > 1 && (
        <nav className="flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams();
            if (status) params.set("status", status);
            if (searchParams.q) params.set("q", searchParams.q);
            if (p > 1) params.set("page", String(p));
            const href = `/${locale}/admin/orders${params.toString() ? `?${params}` : ""}`;
            return (
              <a
                key={p}
                href={href}
                className={`flex h-9 w-9 items-center justify-center rounded-(--radius-button) text-sm ${
                  p === page ? "bg-brand-900 text-paper" : "text-brand-700 hover:bg-brand-100"
                }`}
              >
                {p}
              </a>
            );
          })}
        </nav>
      )}
    </div>
  );
}
