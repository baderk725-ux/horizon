"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { createSupplierAction, updateSupplierAction, type SupplierActionState } from "@/lib/actions/suppliers";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SupplierRow } from "@/lib/data/admin/suppliers";

const initialState: SupplierActionState = { error: null };

export function SupplierForm({ supplier, onDone }: { supplier?: SupplierRow; onDone?: () => void }) {
  const t = useTranslations("adminSuppliers");

  const action = supplier ? updateSupplierAction.bind(null, supplier.id) : createSupplierAction;
  const [state, formAction, pending] = useActionState(
    async (prev: SupplierActionState, formData: FormData) => {
      const result = await action(prev, formData);
      if (!result.error) onDone?.();
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("name")} htmlFor="supplier-name">
          <Input id="supplier-name" name="name" defaultValue={supplier?.name} required />
        </Field>
        <Field label={t("contactPerson")} htmlFor="supplier-contactPerson">
          <Input id="supplier-contactPerson" name="contactPerson" defaultValue={supplier?.contact_person ?? ""} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("phone")} htmlFor="supplier-phone">
          <Input id="supplier-phone" name="phone" defaultValue={supplier?.phone ?? ""} />
        </Field>
        <Field label={t("email")} htmlFor="supplier-email">
          <Input id="supplier-email" name="email" type="email" defaultValue={supplier?.email ?? ""} />
        </Field>
      </div>
      <Field label={t("address")} htmlFor="supplier-address">
        <Input id="supplier-address" name="address" defaultValue={supplier?.address ?? ""} />
      </Field>
      <Field label={t("notes")} htmlFor="supplier-notes">
        <textarea
          id="supplier-notes"
          name="notes"
          rows={3}
          defaultValue={supplier?.notes ?? ""}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </Field>

      {state.error && <p className="text-sm text-danger">{t(state.error)}</p>}

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : supplier ? t("save") : t("create")}
      </Button>
    </form>
  );
}
