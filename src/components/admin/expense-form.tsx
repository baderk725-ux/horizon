"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createExpenseAction, type ExpenseActionState } from "@/lib/actions/expenses";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: ExpenseActionState = { error: null };

export function ExpenseForm() {
  const t = useTranslations("adminFinance");
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (prev: ExpenseActionState, formData: FormData) => {
      const result = await createExpenseAction(prev, formData);
      if (!result.error) router.refresh();
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-5 sm:items-end">
      <Field label={t("category")} htmlFor="expense-category">
        <Input id="expense-category" name="category" required />
      </Field>
      <div className="sm:col-span-2">
        <Field label={t("description")} htmlFor="expense-description">
          <Input id="expense-description" name="description" />
        </Field>
      </div>
      <Field label={t("amount")} htmlFor="expense-amount">
        <Input id="expense-amount" name="amount" type="number" step="0.01" min={0.01} required />
      </Field>
      <Field label={t("date")} htmlFor="expense-date">
        <Input id="expense-date" name="expenseDate" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
      </Field>
      <Button type="submit" size="sm" disabled={pending} className="sm:col-span-5 sm:w-fit">
        {pending ? t("saving") : t("addExpense")}
      </Button>
      {state.error && <p className="text-xs text-danger sm:col-span-5">{t(state.error)}</p>}
    </form>
  );
}
