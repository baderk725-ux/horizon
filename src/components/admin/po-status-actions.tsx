"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { updatePurchaseOrderStatusAction } from "@/lib/actions/purchase-orders";
import { NEXT_PO_STATUSES, type PurchaseOrderStatus } from "@/lib/purchase-orders/status";
import { Button } from "@/components/ui/button";

const CONFIRM_REQUIRED: PurchaseOrderStatus[] = ["cancelled", "received"];

export function POStatusActions({ id, currentStatus }: { id: string; currentStatus: PurchaseOrderStatus }) {
  const t = useTranslations("adminPurchaseOrders");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const options = NEXT_PO_STATUSES[currentStatus] ?? [];
  if (options.length === 0) return null;

  function apply(next: PurchaseOrderStatus) {
    if (CONFIRM_REQUIRED.includes(next) && !window.confirm(t("confirmTransition", { status: t(`status.${next}`) }))) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await updatePurchaseOrderStatusAction(id, currentStatus, next);
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
