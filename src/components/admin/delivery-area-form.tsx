"use client";

import { useActionState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  createDeliveryAreaAction,
  updateDeliveryAreaAction,
  type ShippingActionState,
} from "@/lib/actions/shipping";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { DeliveryAreaRow, GovernorateRow } from "@/lib/data/admin/shipping";

const initialState: ShippingActionState = { error: null };

export function DeliveryAreaForm({
  area,
  governorates,
  defaultGovernorateId,
  onDone,
}: {
  area?: DeliveryAreaRow;
  governorates: GovernorateRow[];
  defaultGovernorateId?: string;
  onDone?: () => void;
}) {
  const t = useTranslations("adminShipping");
  const locale = useLocale();

  const action = area
    ? updateDeliveryAreaAction.bind(null, area.id)
    : createDeliveryAreaAction;

  const [state, formAction, pending] = useActionState(
    async (prev: ShippingActionState, formData: FormData) => {
      const result = await action(prev, formData);
      if (!result.error) onDone?.();
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("nameEn")} htmlFor="area-nameEn">
          <Input id="area-nameEn" name="nameEn" defaultValue={area?.name_en} required />
        </Field>
        <Field label={t("nameAr")} htmlFor="area-nameAr">
          <Input id="area-nameAr" name="nameAr" dir="rtl" defaultValue={area?.name_ar} required />
        </Field>
      </div>

      <Field label={t("governorate")} htmlFor="area-governorateId">
        <select
          id="area-governorateId"
          name="governorateId"
          defaultValue={area?.governorate_id ?? defaultGovernorateId}
          required
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          {governorates.map((g) => (
            <option key={g.id} value={g.id}>
              {locale === "ar" ? g.name_ar : g.name_en}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("deliveryFee")} htmlFor="area-deliveryFee">
          <Input
            id="area-deliveryFee"
            name="deliveryFee"
            type="number"
            step="0.01"
            min={0}
            defaultValue={area?.delivery_fee ?? 0}
            required
          />
        </Field>
        <Field label={t("freeDeliveryThreshold")} htmlFor="area-freeDeliveryThreshold">
          <Input
            id="area-freeDeliveryThreshold"
            name="freeDeliveryThreshold"
            type="number"
            step="0.01"
            min={0}
            defaultValue={area?.free_delivery_threshold ?? ""}
          />
        </Field>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-brand-700">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={area?.is_active ?? true}
            className="h-4 w-4 rounded border-brand-300 text-brand-900 focus:ring-accent-500"
          />
          {t("isActive")}
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-700">
          <input
            type="checkbox"
            name="isConfigured"
            defaultChecked={area?.is_configured ?? true}
            className="h-4 w-4 rounded border-brand-300 text-brand-900 focus:ring-accent-500"
          />
          {t("isConfigured")}
        </label>
      </div>
      <p className="text-xs text-brand-500">{t("isConfiguredHint")}</p>

      {state.error && <p className="text-sm text-danger">{t(state.error)}</p>}

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : area ? t("save") : t("create")}
      </Button>
    </form>
  );
}
