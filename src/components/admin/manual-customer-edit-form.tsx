"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { updateManualCustomerAction, type CustomerActionState } from "@/lib/actions/customers";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: CustomerActionState = { error: null };

export function ManualCustomerEditForm({
  customerId,
  fullName,
  phone,
  email,
  address,
  notes,
}: {
  customerId: string;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
}) {
  const t = useTranslations("adminCustomers");
  const [editing, setEditing] = useState(false);
  const action = updateManualCustomerAction.bind(null, customerId);
  const [state, formAction, pending] = useActionState(
    async (prev: CustomerActionState, formData: FormData) => {
      const result = await action(prev, formData);
      if (!result.error) setEditing(false);
      return result;
    },
    initialState,
  );

  if (!editing) {
    return (
      <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(true)}>
        {t("editCustomer")}
      </Button>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("name")} htmlFor="customer-fullName">
          <Input id="customer-fullName" name="fullName" defaultValue={fullName ?? ""} required />
        </Field>
        <Field label={t("phone")} htmlFor="customer-phone">
          <Input id="customer-phone" name="phone" defaultValue={phone ?? ""} required />
        </Field>
      </div>
      <Field label={t("email")} htmlFor="customer-email">
        <Input id="customer-email" name="email" type="email" defaultValue={email ?? ""} />
      </Field>
      <Field label={t("address")} htmlFor="customer-address">
        <Input id="customer-address" name="address" defaultValue={address ?? ""} />
      </Field>
      <Field label={t("notes")} htmlFor="customer-notes">
        <textarea
          id="customer-notes"
          name="notes"
          rows={3}
          defaultValue={notes ?? ""}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
        />
      </Field>

      {state.error && <p className="text-sm text-danger">{t(state.error)}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? t("saving") : t("save")}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
