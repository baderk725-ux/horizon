"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { updateWholesaleApplicationStatusAction } from "@/lib/actions/wholesale";
import { Button } from "@/components/ui/button";

export function WholesaleDecisionActions({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const t = useTranslations("adminWholesale");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (currentStatus !== "pending") return null;

  function decide(next: "approved" | "rejected") {
    if (next === "rejected" && !window.confirm(t("confirmReject"))) return;
    setError(null);
    startTransition(async () => {
      const result = await updateWholesaleApplicationStatusAction(applicationId, currentStatus, next);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="button" size="sm" disabled={pending} onClick={() => decide("approved")}>
        {t("approve")}
      </Button>
      <Button type="button" size="sm" variant="secondary" disabled={pending} onClick={() => decide("rejected")}>
        {t("reject")}
      </Button>
      {error && <span className="text-xs text-danger">{t(error)}</span>}
    </div>
  );
}
