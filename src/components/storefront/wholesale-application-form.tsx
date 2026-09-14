"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitWholesaleApplicationAction, type WholesaleActionState } from "@/lib/actions/wholesale";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: WholesaleActionState = { error: null };

export function WholesaleApplicationForm({
  governorates,
  defaultFullName,
  defaultPhone,
  defaultEmail,
}: {
  governorates: { id: string; name_en: string; name_ar: string }[];
  defaultFullName?: string;
  defaultPhone?: string;
  defaultEmail?: string;
}) {
  const t = useTranslations("account");
  const [state, formAction, pending] = useActionState(submitWholesaleApplicationAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("fullName")} htmlFor="w-fullName">
          <Input id="w-fullName" name="fullName" defaultValue={defaultFullName} required />
        </Field>
        <Field label={t("companyName")} htmlFor="w-companyName">
          <Input id="w-companyName" name="companyName" required />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("phone")} htmlFor="w-phone">
          <Input id="w-phone" name="phone" defaultValue={defaultPhone} required />
        </Field>
        <Field label={t("email")} htmlFor="w-email">
          <Input id="w-email" name="email" type="email" defaultValue={defaultEmail} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("governorate")} htmlFor="w-governorateId">
          <select
            id="w-governorateId"
            name="governorateId"
            className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="">{t("selectGovernorate")}</option>
            {governorates.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name_en}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("area")} htmlFor="w-areaText">
          <Input id="w-areaText" name="areaText" />
        </Field>
      </div>

      <Field label={t("address")} htmlFor="w-address">
        <Input id="w-address" name="address" required />
      </Field>

      <Field label={t("commercialRegistrationNumber")} htmlFor="w-crn">
        <Input id="w-crn" name="commercialRegistrationNumber" required />
      </Field>

      <Field label={t("commercialDocument")} htmlFor="w-document">
        <input
          id="w-document"
          name="commercialDocument"
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          required
          className="w-full text-sm text-brand-700"
        />
      </Field>

      <Field label={t("wholesaleNotes")} htmlFor="w-notes">
        <textarea
          id="w-notes"
          name="notes"
          rows={3}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </Field>

      {state.error && <p className="text-sm text-danger">{t(state.error)}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? t("submitting") : t("submitApplication")}
      </Button>
    </form>
  );
}
