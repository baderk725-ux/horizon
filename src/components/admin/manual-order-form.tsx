"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { createManualOrderAction, type ManualOrderActionState } from "@/lib/actions/manual-order";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GovernorateAreaSelect } from "@/components/storefront/governorate-area-select";
import { ManualOrderItemPicker, type OrderLine } from "@/components/admin/manual-order-item-picker";
import type { GovernorateWithAreas } from "@/lib/data/checkout";
import type { ManualCustomerRow } from "@/lib/data/admin/manual-customers";

const initialState: ManualOrderActionState = { error: null };

export function ManualOrderForm({
  governorates,
  manualCustomers,
}: {
  governorates: GovernorateWithAreas[];
  manualCustomers: ManualCustomerRow[];
}) {
  const t = useTranslations("adminOrders");
  const [state, formAction, pending] = useActionState(createManualOrderAction, initialState);
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const selectedCustomer = manualCustomers.find((c) => c.id === selectedCustomerId);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      <input type="hidden" name="items" value={JSON.stringify(lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })))} />

      <Field label={t("existingManualCustomer")} htmlFor="manualCustomerId">
        <select
          id="manualCustomerId"
          name="manualCustomerId"
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
        >
          <option value="">{t("newCustomer")}</option>
          {manualCustomers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name} — {c.phone}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("name")} htmlFor="fullName">
          <Input
            id="fullName"
            name="fullName"
            required
            defaultValue={selectedCustomer?.full_name}
            key={`name-${selectedCustomerId}`}
            invalid={!!state.fieldErrors?.fullName}
          />
        </Field>
        <Field label={t("phone")} htmlFor="phone" error={state.fieldErrors?.phone ? t("invalid_phone") : undefined}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="079xxxxxxx"
            required
            defaultValue={selectedCustomer?.phone}
            key={`phone-${selectedCustomerId}`}
            invalid={!!state.fieldErrors?.phone}
          />
        </Field>
      </div>

      <Field label={t("email")} htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={selectedCustomer?.email ?? undefined}
          key={`email-${selectedCustomerId}`}
        />
      </Field>

      {!selectedCustomerId && (
        <label className="flex items-center gap-3 text-sm text-brand-700">
          <input
            type="checkbox"
            name="saveAsNewCustomer"
            defaultChecked
            className="h-4 w-4 rounded border-brand-300 text-brand-900 focus:ring-accent-500"
          />
          {t("saveAsNewCustomer")}
        </label>
      )}

      <GovernorateAreaSelect
        governorates={governorates}
        invalidGovernorate={!!state.fieldErrors?.governorateId}
        invalidArea={!!state.fieldErrors?.areaId}
      />

      <Field label={t("fullAddress")} htmlFor="fullAddress">
        <textarea
          id="fullAddress"
          name="fullAddress"
          required
          rows={2}
          defaultValue={selectedCustomer?.address ?? undefined}
          key={`address-${selectedCustomerId}`}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
        />
      </Field>

      <ManualOrderItemPicker lines={lines} onChange={setLines} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("customerNotes")} htmlFor="notes">
          <textarea
            id="notes"
            name="notes"
            rows={2}
            className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
          />
        </Field>
        <Field label={t("internalNotes")} htmlFor="internalNotes">
          <textarea
            id="internalNotes"
            name="internalNotes"
            rows={2}
            placeholder={t("channelPlaceholder")}
            className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
          />
        </Field>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {t(state.error)}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending || lines.length === 0}>
        {pending ? t("placing") : t("createManualOrder")}
      </Button>
      {lines.length === 0 && (
        <p className="text-xs text-brand-500">{t("addAtLeastOneProduct")}</p>
      )}
    </form>
  );
}
