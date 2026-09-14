"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { recordWholesalePaymentAction, type WholesaleActionState } from "@/lib/actions/wholesale";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { WholesaleChargeRow } from "@/lib/data/admin/wholesale";

const initialState: WholesaleActionState = { error: null };

export function WholesalePaymentForm({
  customerId,
  openCharges,
}: {
  customerId: string;
  openCharges: WholesaleChargeRow[];
}) {
  const t = useTranslations("adminWholesale");
  const action = recordWholesalePaymentAction.bind(null, customerId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-4 sm:items-end">
      <div className="sm:col-span-2">
        <Field label={t("appliesToCharge")} htmlFor="payment-chargeId">
          <select
            id="payment-chargeId"
            name="chargeId"
            className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-3 py-2.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="">{t("unallocated")}</option>
            {openCharges.map((charge) => (
              <option key={charge.id} value={charge.id}>
                {charge.description ?? t("chargeDescription")} — {charge.amount.toFixed(2)}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label={t("amount")} htmlFor="payment-amount">
        <Input id="payment-amount" name="amount" type="number" step="0.01" min={0.01} required />
      </Field>
      <Field label={t("method")} htmlFor="payment-method">
        <Input id="payment-method" name="method" />
      </Field>
      <Button type="submit" size="sm" disabled={pending} className="sm:col-span-4 sm:w-fit">
        {pending ? t("saving") : t("recordPayment")}
      </Button>
      {state.error && <p className="text-xs text-danger sm:col-span-4">{t(state.error)}</p>}
    </form>
  );
}
