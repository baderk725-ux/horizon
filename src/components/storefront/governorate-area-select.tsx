"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Field } from "@/components/ui/input";
import type { GovernorateWithAreas } from "@/lib/data/checkout";

export function GovernorateAreaSelect({
  governorates,
  invalidGovernorate,
  invalidArea,
}: {
  governorates: GovernorateWithAreas[];
  invalidGovernorate?: boolean;
  invalidArea?: boolean;
}) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const [governorateId, setGovernorateId] = useState("");

  const areas = governorates.find((g) => g.id === governorateId)?.areas ?? [];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label={t("governorate")} htmlFor="governorateId">
        <select
          id="governorateId"
          name="governorateId"
          required
          value={governorateId}
          onChange={(e) => setGovernorateId(e.target.value)}
          aria-invalid={invalidGovernorate}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
        >
          <option value="">{t("selectGovernorate")}</option>
          {governorates.map((g) => (
            <option key={g.id} value={g.id}>
              {locale === "ar" ? g.name_ar : g.name_en}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("area")} htmlFor="areaId">
        <select
          id="areaId"
          name="areaId"
          required
          disabled={!governorateId}
          defaultValue=""
          aria-invalid={invalidArea}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1 disabled:opacity-50"
        >
          <option value="">
            {governorateId ? t("selectArea") : t("selectGovernorateFirst")}
          </option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {locale === "ar" ? a.name_ar : a.name_en} —{" "}
              {a.delivery_fee > 0 ? `${a.delivery_fee.toFixed(2)} ${t("currency")}` : t("freeDelivery")}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}
