"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { updatePaymentStatusAction } from "@/lib/actions/payments";
import { NEXT_PAYMENT_STATUSES, type PaymentStatus } from "@/lib/payments/status";
import { Button } from "@/components/ui/button";

const CONFIRM_REQUIRED: PaymentStatus[] = ["refunded"];

export function PaymentStatusActions({
  paymentId,
  orderId,
  currentStatus,
}: {
  paymentId: string;
  orderId: string;
  currentStatus: PaymentStatus;
}) {
  const t = useTranslations("adminPayments");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const options = NEXT_PAYMENT_STATUSES[currentStatus] ?? [];
  if (options.length === 0) return null;

  function apply(next: PaymentStatus) {
    if (CONFIRM_REQUIRED.includes(next) && !window.confirm(t("confirmTransition", { status: t(`status.${next}`) }))) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await updatePaymentStatusAction(paymentId, currentStatus, next, orderId);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {options.map((next) => (
        <Button
          key={next}
          type="button"
          size="sm"
          variant={next === "failed" ? "secondary" : "primary"}
          disabled={pending}
          onClick={() => apply(next)}
        >
          {t(`actions.${next}`)}
        </Button>
      ))}
      {error && <span className="text-xs text-danger">{t(error)}</span>}
    </div>
  );
}
