"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { recordPayrollPaymentAction, type PayrollActionState } from "@/lib/actions/payroll";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: PayrollActionState = { error: null };

export function PayrollPaymentForm({ profileId }: { profileId: string }) {
  const t = useTranslations("adminPayroll");
  const router = useRouter();
  const action = recordPayrollPaymentAction.bind(null, profileId);
  const [state, formAction, pending] = useActionState(
    async (prev: PayrollActionState, formData: FormData) => {
      const result = await action(prev, formData);
      if (!result.error) router.refresh();
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-4 sm:items-end">
      <Field label={t("period")} htmlFor="payroll-period">
        <Input id="payroll-period" name="period" placeholder={t("periodPlaceholder")} required />
      </Field>
      <Field label={t("amount")} htmlFor="payroll-amount">
        <Input id="payroll-amount" name="amount" type="number" step="0.01" min={0.01} required />
      </Field>
      <Field label={t("paymentDate")} htmlFor="payroll-paymentDate">
        <Input
          id="payroll-paymentDate"
          name="paymentDate"
          type="date"
          required
          defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </Field>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : t("recordPayment")}
      </Button>
      {state.error && <p className="text-xs text-danger sm:col-span-4">{t(state.error)}</p>}
    </form>
  );
}
