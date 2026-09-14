"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { deleteExpenseAction } from "@/lib/actions/expenses";
import type { ExpenseRow } from "@/lib/data/admin/finance";

export function ExpensesList({ expenses }: { expenses: ExpenseRow[] }) {
  const t = useTranslations("adminFinance");
  const tOrders = useTranslations("adminOrders");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function remove(id: string) {
    if (!window.confirm(t("deleteConfirm"))) return;
    startTransition(async () => {
      await deleteExpenseAction(id);
      router.refresh();
    });
  }

  if (expenses.length === 0) {
    return <p className="text-sm text-brand-500">{t("noExpenses")}</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
          <th className="px-5 py-3 text-start">{t("category")}</th>
          <th className="px-5 py-3 text-start">{t("description")}</th>
          <th className="px-5 py-3 text-start">{t("amount")}</th>
          <th className="px-5 py-3 text-start">{t("date")}</th>
          <th className="px-5 py-3 text-end">{t("actions")}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-brand-200">
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td className="px-5 py-3 font-medium text-brand-900">{expense.category}</td>
            <td className="px-5 py-3 text-brand-700">{expense.description ?? "—"}</td>
            <td className="px-5 py-3 text-brand-700">
              {expense.amount.toFixed(2)} {tOrders("currency")}
            </td>
            <td className="px-5 py-3 text-brand-500">{expense.expense_date}</td>
            <td className="px-5 py-3 text-end">
              <button
                type="button"
                disabled={pending}
                onClick={() => remove(expense.id)}
                className="text-sm font-medium text-danger hover:underline disabled:opacity-50"
              >
                {t("delete")}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
