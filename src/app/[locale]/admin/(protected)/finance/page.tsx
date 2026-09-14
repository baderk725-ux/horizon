import { getTranslations } from "next-intl/server";
import { getAdminExpenses, getFinanceSummary } from "@/lib/data/admin/finance";
import { ExpenseForm } from "@/components/admin/expense-form";
import { ExpensesList } from "@/components/admin/expenses-list";

function monthRange(): { from: string; to: string } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  return { from, to };
}

export default async function AdminFinancePage(props: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("adminFinance");
  const tOrders = await getTranslations("adminOrders");

  const defaults = monthRange();
  const from = searchParams.from ?? defaults.from;
  const to = searchParams.to ?? defaults.to;

  const [summary, expenses] = await Promise.all([
    getFinanceSummary({ from, to }),
    getAdminExpenses({ from, to }),
  ]);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <form className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="finance-from" className="block text-xs font-medium uppercase tracking-wider text-brand-700">
            {t("from")}
          </label>
          <input
            id="finance-from"
            type="date"
            name="from"
            defaultValue={from}
            className="mt-1 rounded-(--radius-button) border border-brand-300 bg-paper px-3 py-2 text-sm text-brand-900"
          />
        </div>
        <div>
          <label htmlFor="finance-to" className="block text-xs font-medium uppercase tracking-wider text-brand-700">
            {t("to")}
          </label>
          <input
            id="finance-to"
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-(--radius-card) border border-brand-200 bg-paper p-5">
          <p className="text-xs uppercase tracking-wider text-brand-500">{t("revenue")}</p>
          <p className="mt-2 font-display text-2xl text-brand-900">
            {summary.revenue.toFixed(2)} {tOrders("currency")}
          </p>
          <p className="mt-1 text-xs text-brand-500">{t("orderCount", { count: summary.orderCount })}</p>
        </div>
        <div className="rounded-(--radius-card) border border-brand-200 bg-paper p-5">
          <p className="text-xs uppercase tracking-wider text-brand-500">{t("expensesTotal")}</p>
          <p className="mt-2 font-display text-2xl text-brand-900">
            {summary.expenses.toFixed(2)} {tOrders("currency")}
          </p>
        </div>
        <div className="rounded-(--radius-card) border border-brand-200 bg-paper p-5">
          <p className="text-xs uppercase tracking-wider text-brand-500">{t("revenueMinusExpenses")}</p>
          <p className={`mt-2 font-display text-2xl ${summary.net >= 0 ? "text-green-700" : "text-danger"}`}>
            {summary.net.toFixed(2)} {tOrders("currency")}
          </p>
          <p className="mt-1 text-xs text-brand-500">{t("netNote")}</p>
        </div>
      </div>

      {summary.expensesByCategory.length > 0 && (
        <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-5">
          <h2 className="font-display text-lg text-brand-900">{t("byCategory")}</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {summary.expensesByCategory.map((c) => (
              <li key={c.category} className="flex justify-between">
                <span className="text-brand-700">{c.category}</span>
                <span className="text-brand-900">
                  {c.amount.toFixed(2)} {tOrders("currency")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <h2 className="font-display text-lg text-brand-900">{t("expenses")}</h2>
        <div className="mt-4">
          <ExpenseForm />
        </div>
        <div className="mt-6 overflow-x-auto">
          <ExpensesList expenses={expenses} />
        </div>
      </section>
    </div>
  );
}
