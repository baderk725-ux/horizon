"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  createCouponAction,
  updateCouponAction,
  type DiscountActionState,
} from "@/lib/actions/discounts";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AdminCouponRow } from "@/lib/data/admin/discounts";

const initialState: DiscountActionState = { error: null };

export function CouponForm({
  coupon,
  onDone,
}: {
  coupon?: AdminCouponRow;
  onDone?: () => void;
}) {
  const t = useTranslations("adminDiscounts");

  const action = coupon ? updateCouponAction.bind(null, coupon.id) : createCouponAction;

  const [state, formAction, pending] = useActionState(
    async (prev: DiscountActionState, formData: FormData) => {
      const result = await action(prev, formData);
      if (!result.error) onDone?.();
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("code")} htmlFor="coupon-code">
          <Input
            id="coupon-code"
            name="code"
            defaultValue={coupon?.code}
            placeholder={t("codePlaceholder")}
            required
          />
        </Field>
        <Field label={t("discountType")} htmlFor="coupon-discountType">
          <select
            id="coupon-discountType"
            name="discountType"
            defaultValue={coupon?.discount_type ?? "percent"}
            required
            className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="percent">{t("percent")}</option>
            <option value="fixed">{t("fixed")}</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={t("value")} htmlFor="coupon-value">
          <Input
            id="coupon-value"
            name="value"
            type="number"
            step="0.01"
            min={0.01}
            defaultValue={coupon?.value}
            required
          />
        </Field>
        <Field label={t("minOrderAmount")} htmlFor="coupon-minOrderAmount">
          <Input
            id="coupon-minOrderAmount"
            name="minOrderAmount"
            type="number"
            step="0.01"
            min={0}
            defaultValue={coupon?.min_order_amount ?? ""}
          />
        </Field>
        <Field label={t("maxUses")} htmlFor="coupon-maxUses">
          <Input
            id="coupon-maxUses"
            name="maxUses"
            type="number"
            step="1"
            min={1}
            defaultValue={coupon?.max_uses ?? ""}
          />
        </Field>
      </div>

      <Field label={t("expiresAt")} htmlFor="coupon-expiresAt">
        <Input
          id="coupon-expiresAt"
          name="expiresAt"
          type="date"
          defaultValue={coupon?.expires_at ?? ""}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-brand-700">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={coupon?.is_active ?? true}
          className="h-4 w-4 rounded border-brand-300 text-brand-900 focus:ring-accent-500"
        />
        {t("isActive")}
      </label>

      {coupon && coupon.used_count > 0 && (
        <p className="text-xs text-brand-500">{t("usedCount", { count: coupon.used_count })}</p>
      )}

      {state.error && <p className="text-sm text-danger">{t(state.error)}</p>}

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : coupon ? t("save") : t("create")}
      </Button>
    </form>
  );
}
