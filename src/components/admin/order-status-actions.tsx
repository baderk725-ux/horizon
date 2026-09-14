"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { updateOrderStatusAction } from "@/lib/actions/orders";
import { NEXT_STATUSES, type OrderStatus } from "@/lib/orders/status";
import { Button } from "@/components/ui/button";

const CONFIRM_REQUIRED: OrderStatus[] = ["cancelled"];

export function OrderStatusActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const t = useTranslations("adminOrders");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const options = NEXT_STATUSES[currentStatus] ?? [];
  if (options.length === 0) return null;

  function apply(next: OrderStatus) {
    if (CONFIRM_REQUIRED.includes(next) && !window.confirm(t("confirmTransition", { status: t(`status.${next}`) }))) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, currentStatus, next);
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
          variant={next === "cancelled" ? "secondary" : "primary"}
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
