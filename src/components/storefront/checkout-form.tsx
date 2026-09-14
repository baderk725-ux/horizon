"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitOrderAction, type CheckoutActionState } from "@/lib/actions/checkout";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GovernorateAreaSelect } from "@/components/storefront/governorate-area-select";
import type { GovernorateWithAreas } from "@/lib/data/checkout";

const initialState: CheckoutActionState = { error: null };

export function CheckoutForm({
  governorates,
  defaultName,
  defaultPhone,
  defaultEmail,
}: {
  governorates: GovernorateWithAreas[];
  defaultName?: string;
  defaultPhone?: string;
  defaultEmail?: string;
}) {
  const t = useTranslations("checkout");
  const [state, formAction, pending] = useActionState(submitOrderAction, initialState);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("fullName")} htmlFor="fullName">
          <Input
            id="fullName"
            name="fullName"
            required
            defaultValue={defaultName}
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
            defaultValue={defaultPhone}
            invalid={!!state.fieldErrors?.phone}
          />
        </Field>
      </div>

      <Field label={t("email")} htmlFor="email">
        <Input id="email" name="email" type="email" defaultValue={defaultEmail} />
      </Field>

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
          rows={3}
          placeholder={t("fullAddressPlaceholder")}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
        />
      </Field>

      <Field label={t("notes")} htmlFor="notes">
        <textarea
          id="notes"
          name="notes"
          rows={2}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
        />
      </Field>

      <label className="flex items-start gap-3 text-sm text-brand-700">
        <input
          type="checkbox"
          name="termsAccepted"
          required
          className="mt-0.5 h-4 w-4 rounded border-brand-300 text-brand-900 focus:ring-accent-500"
        />
        {t("acceptTerms")}
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {t(state.error)}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? t("placing") : t("placeOrder")}
      </Button>
      <p className="text-center text-xs text-brand-500">{t("codNotice")}</p>
    </form>
  );
}
