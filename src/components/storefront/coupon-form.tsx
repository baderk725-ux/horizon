"use client";

import { useActionState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { applyCouponAction, removeCouponAction, type CouponFormState } from "@/lib/actions/coupon";
import { Button } from "@/components/ui/button";
import type { CouponPreview } from "@/lib/data/cart";

const initialState: CouponFormState = { error: null };

export function CouponForm({
  couponCode,
  couponPreview,
}: {
  couponCode: string | null;
  couponPreview: CouponPreview | null;
}) {
  const t = useTranslations("cart");
  const router = useRouter();
  const [removing, startRemoveTransition] = useTransition();

  const [state, formAction, pending] = useActionState(
    async (prev: CouponFormState, formData: FormData) => {
      const result = await applyCouponAction(prev, formData);
      if (!result.error) router.refresh();
      return result;
    },
    initialState,
  );

  function remove() {
    startRemoveTransition(async () => {
      await removeCouponAction();
      router.refresh();
    });
  }

  if (couponCode) {
    const valid = couponPreview?.valid ?? false;
    return (
      <div className="mt-4 rounded-(--radius-button) border border-brand-200 p-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-medium text-brand-900">{couponCode}</p>
            {valid && couponPreview?.valid && (
              <p className="text-xs text-green-700">
                {t("couponApplied", { amount: couponPreview.discountAmount.toFixed(2) })}
              </p>
            )}
            {!valid && (
              <p className="text-xs text-danger">
                {t(`coupon_${(couponPreview as { reason: string } | null)?.reason ?? "not_found"}`)}
              </p>
            )}
          </div>
          <button
            type="button"
            disabled={removing}
            onClick={remove}
            className="text-xs font-medium text-brand-500 underline hover:text-danger disabled:opacity-50"
          >
            {t("removeCoupon")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-4 flex items-start gap-2">
      <div className="flex-1">
        <input
          type="text"
          name="code"
          placeholder={t("couponPlaceholder")}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-3 py-2 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
        {state.error && <p className="mt-1 text-xs text-danger">{t(`coupon_${state.error}`)}</p>}
      </div>
      <Button type="submit" size="sm" variant="secondary" disabled={pending}>
        {pending ? t("applying") : t("apply")}
      </Button>
    </form>
  );
}
