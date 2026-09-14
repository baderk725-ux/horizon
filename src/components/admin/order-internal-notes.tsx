"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateOrderInternalNotesAction } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";

export function OrderInternalNotes({
  orderId,
  initialNotes,
}: {
  orderId: string;
  initialNotes: string | null;
}) {
  const t = useTranslations("adminOrders");
  const [value, setValue] = useState(initialNotes ?? "");
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  return (
    <div>
      <label htmlFor="internal-notes" className="block text-xs font-medium uppercase tracking-wider text-brand-700">
        {t("internalNotes")}
      </label>
      <textarea
        id="internal-notes"
        rows={3}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setStatus("idle");
        }}
        className="mt-1.5 w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
      />
      <div className="mt-2 flex items-center gap-3">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await updateOrderInternalNotesAction(orderId, value);
              setStatus(result.error ? "error" : "saved");
            })
          }
        >
          {pending ? t("saving") : t("save")}
        </Button>
        {status === "saved" && <span className="text-xs text-success">{t("saved")}</span>}
        {status === "error" && <span className="text-xs text-danger">{t("update_failed")}</span>}
      </div>
    </div>
  );
}
