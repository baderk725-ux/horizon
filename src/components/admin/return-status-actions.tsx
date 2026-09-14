"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { updateReturnStatusAction } from "@/lib/actions/returns";
import { NEXT_RETURN_STATUSES, type ReturnStatus } from "@/lib/returns/status";
import { Button } from "@/components/ui/button";

const CONFIRM_REQUIRED: ReturnStatus[] = ["rejected", "completed"];

export function ReturnStatusActions({
  returnId,
  currentStatus,
}: {
  returnId: string;
  currentStatus: ReturnStatus;
}) {
  const t = useTranslations("adminReturns");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const options = NEXT_RETURN_STATUSES[currentStatus] ?? [];
  if (options.length === 0) return null;

  function apply(next: ReturnStatus) {
    if (CONFIRM_REQUIRED.includes(next) && !window.confirm(t("confirmTransition", { status: t(`status.${next}`) }))) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await updateReturnStatusAction(returnId, currentStatus, next);
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
          variant={next === "rejected" ? "secondary" : "primary"}
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
