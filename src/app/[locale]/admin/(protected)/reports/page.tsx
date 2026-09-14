import { getTranslations, getLocale } from "next-intl/server";
import { getSalesByDay, getTopProducts, getReportsOverview } from "@/lib/data/admin/reports";

function monthRange(): { from: string; to: string } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  return { from, to };
}

export default async function AdminReportsPage(props: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("adminReports");
  const tOrders = await getTranslations("adminOrders");
  const locale = await getLocale();

  const defaults = monthRange();
  const from = searchParams.from ?? defaults.from;
  const to = searchParams.to ?? defaults.to;

  const [salesByDay, topProducts, overview] = await Promise.all([
    getSalesByDay({ from, to }),
    getTopProducts({ from, to, limit: 10 }),
    getReportsOverview({ from, to }),
  ]);

  const totalRevenue = salesByDay.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = salesByDay.reduce((sum, d) => sum + d.orderCount, 0);
  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-JO", { dateStyle: "medium" });

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <form className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="reports-from" className="block text-xs font-medium uppercase tracking-wider text-brand-700">
            {t("from")}
          </label>
          <input
            id="reports-from"
            type="date"
            name="from"
            defaultValue={from}
            className="mt-1 rounded-(--radius-button) border border-brand-300 bg-paper px-3 py-2 text-sm text-brand-900"
          />
        </div>
        <div>
          <label htmlFor="reports-to" className="block text-xs font-medium uppercase tracking-wider text-brand-700">
            {t("to")}
          </label>
          <input
            id="reports-to"
            type="date"
            name="to"
            defaultValue={to}
            className="mt-1 rounded-(--radius-button) border border-brand-300 bg-paper px-3 py-2 text-sm text-brand-900"
          />
        </div>
        <button
          type="submit"
          className="rounded-(--radius-button) bg-brand-900 px-4 py-2 text-sm font-medium text-paper hover:bg-brand-800"
        >
          {t("apply")}
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-(--radius-card) border border-brand-200 bg-paper p-5">
          <p className="text-xs uppercase tracking-wider text-brand-500">{t("totalRevenue")}</p>
          <p className="mt-2 font-display text-2xl text-brand-900">
            {totalRevenue.toFixed(2)} {tOrders("currency")}
          </p>
        </div>
        <div className="rounded-(--radius-card) border border-brand-200 bg-paper p-5">
          <p className="text-xs uppercase tracking-wider text-brand-500">{t("totalOrders")}</p>
          <p className="mt-2 font-display text-2xl text-brand-900">{totalOrders}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-(--radius-card) border border-brand-200 bg-paper p-5">
          <p className="text-xs uppercase tracking-wider text-brand-500">{t("newCustomers")}</p>
          <p className="mt-2 font-display text-2xl text-brand-900">{overview.newCustomers}</p>
        </div>
        <div className="rounded-(--radius-card) border border-brand-200 bg-paper p-5">
          <p className="text-xs uppercase tracking-wider text-brand-500">{t("returnsCount")}</p>
          <p className="mt-2 font-display text-2xl text-brand-900">{overview.returnsCount}</p>
        </div>
        <div className="rounded-(--radius-card) border border-brand-200 bg-paper p-5">
          <p className="text-xs uppercase tracking-wider text-brand-500">{t("expensesInRange")}</p>
          <p className="mt-2 font-display text-2xl text-brand-900">
            {overview.expensesTotal.toFixed(2)} {tOrders("currency")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-(--radius-card) border border-brand-200 bg-paper p-5">
          <p className="text-xs uppercase tracking-wider text-brand-500">{t("lowStockNow")}</p>
          <p className="mt-2 font-display text-2xl text-amber-700">{overview.lowStockCount}</p>
        </div>
        <div className="rounded-(--radius-card) border border-brand-200 bg-paper p-5">
          <p className="text-xs uppercase tracking-wider text-brand-500">{t("outOfStockNow")}</p>
          <p className="mt-2 font-display text-2xl text-danger">{overview.outOfStockCount}</p>
        </div>
      </div>

      <section className="rounded-(--radius-card) border border-brand-200 bg-paper">
        <h2 className="p-6 pb-0 font-display text-lg text-brand-900">{t("salesByDay")}</h2>
        {salesByDay.length === 0 ? (
          <p className="px-6 py-4 text-sm text-brand-500">{t("noData")}</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-y border-brand-200 text-xs uppercase tracking-wider text-brand-500">
                <th className="px-6 py-3 text-start">{tOrders("date")}</th>
                <th className="px-6 py-3 text-start">{t("orders")}</th>
                <th className="px-6 py-3 text-start">{t("revenue")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {salesByDay.map((d) => (
                <tr key={d.date}>
                  <td className="px-6 py-3 text-brand-900">{dateFormatter.format(new Date(d.date))}</td>
                  <td className="px-6 py-3 text-brand-700">{d.orderCount}</td>
                  <td className="px-6 py-3 text-brand-700">
                    {d.revenue.toFixed(2)} {tOrders("currency")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rounded-(--radius-card) border border-brand-200 bg-paper">
        <h2 className="p-6 pb-0 font-display text-lg text-brand-900">{t("topProducts")}</h2>
        {topProducts.length === 0 ? (
          <p className="px-6 py-4 text-sm text-brand-500">{t("noData")}</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-y border-brand-200 text-xs uppercase tracking-wider text-brand-500">
                <th className="px-6 py-3 text-start">{tOrders("product")}</th>
                <th className="px-6 py-3 text-start">{t("unitsSold")}</th>
                <th className="px-6 py-3 text-start">{t("revenue")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {topProducts.map((p) => (
                <tr key={p.productId ?? p.nameEn}>
                  <td className="px-6 py-3 text-brand-900">{locale === "ar" ? p.nameAr : p.nameEn}</td>
                  <td className="px-6 py-3 text-brand-700">{p.unitsSold}</td>
                  <td className="px-6 py-3 text-brand-700">
                    {p.revenue.toFixed(2)} {tOrders("currency")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
