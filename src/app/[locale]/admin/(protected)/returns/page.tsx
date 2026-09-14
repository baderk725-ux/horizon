import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ReturnStatusBadge } from "@/components/admin/return-status-badge";
import { getAdminReturns, RETURN_STATUSES, type ReturnStatus } from "@/lib/data/admin/returns";

export default async function AdminReturnsPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("adminReturns");
  const tOrders = await getTranslations("adminOrders");
  const locale = await getLocale();

  const status = (RETURN_STATUSES as string[]).includes(searchParams.status ?? "")
    ? (searchParams.status as ReturnStatus)
    : undefined;

  const returns = await getAdminReturns({ status });

  const tabs: { key: ReturnStatus | "all"; label: string }[] = [
    { key: "all", label: t("allReturns") },
    ...RETURN_STATUSES.map((s) => ({ key: s, label: t(`status.${s}`) })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const params = new URLSearchParams();
          if (tab.key !== "all") params.set("status", tab.key);
          const href = `/${locale}/admin/returns${params.toString() ? `?${params}` : ""}`;
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

      {returns.length === 0 ? (
        <p className="text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="px-5 py-3 text-start">{tOrders("orderNumber")}</th>
                <th className="px-5 py-3 text-start">{tOrders("customer")}</th>
                <th className="px-5 py-3 text-start">{t("reason")}</th>
                <th className="px-5 py-3 text-start">{t("status.label")}</th>
                <th className="px-5 py-3 text-start">{tOrders("date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {returns.map((ret) => (
                <tr key={ret.id}>
                  <td className="px-5 py-3">
                    <Link href={`/admin/returns/${ret.id}`} className="font-medium text-brand-900 hover:underline">
                      {ret.order?.order_number ?? "—"}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-brand-700">
                    {ret.order?.customer?.full_name ?? ret.order?.guest_name ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-brand-700">{t(`reasonLabels.${ret.reason}`)}</td>
                  <td className="px-5 py-3">
                    <ReturnStatusBadge status={ret.status as ReturnStatus} label={t(`status.${ret.status}`)} />
                  </td>
                  <td className="px-5 py-3 text-brand-500">
                    {new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-JO", {
                      dateStyle: "medium",
                    }).format(new Date(ret.created_at))}
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
