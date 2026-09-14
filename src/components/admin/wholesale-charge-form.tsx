"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { recordWholesaleChargeAction, type WholesaleActionState } from "@/lib/actions/wholesale";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: WholesaleActionState = { error: null };

export function WholesaleChargeForm({ customerId }: { customerId: string }) {
  const t = useTranslations("adminWholesale");
  const action = recordWholesaleChargeAction.bind(null, customerId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-4 sm:items-end">
      <div className="sm:col-span-2">
        <Field label={t("chargeDescription")} htmlFor="charge-description">
          <Input id="charge-description" name="description" />
        </Field>
      </div>
      <Field label={t("amount")} htmlFor="charge-amount">
        <Input id="charge-amount" name="amount" type="number" step="0.01" min={0.01} required />
      </Field>
      <Field label={t("dueDate")} htmlFor="charge-dueDate">
        <Input id="charge-dueDate" name="dueDate" type="date" required />
      </Field>
      <Button type="submit" size="sm" disabled={pending} className="sm:col-span-4 sm:w-fit">
        {pending ? t("saving") : t("addCharge")}
      </Button>
      {state.error && <p className="text-xs text-danger sm:col-span-4">{t(state.error)}</p>}
    </form>
  );
}
