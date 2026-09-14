"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createReturnAction, type ReturnActionState } from "@/lib/actions/returns";
import { RETURN_REASONS } from "@/lib/validation/returns";
import { Button } from "@/components/ui/button";

const initialState: ReturnActionState = { error: null };

export function ReturnRequestForm({ orderId }: { orderId: string }) {
  const t = useTranslations("account");
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [state, formAction, pending] = useActionState(
    async (prev: ReturnActionState, formData: FormData) => {
      const result = await createReturnAction(prev, formData);
      if (!result.error) {
        setOpen(false);
        router.refresh();
      }
      return result;
    },
    initialState,
  );

  if (!open) {
    return (
      <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(true)}>
        {t("requestReturn")}
      </Button>
    );
  }

  return (
    <form action={formAction} className="mt-3 space-y-3 rounded-(--radius-card) border border-brand-200 bg-paper-muted p-4">
      <input type="hidden" name="orderId" value={orderId} />
      <div>
        <label htmlFor={`reason-${orderId}`} className="block text-xs font-medium uppercase tracking-wider text-brand-700">
          {t("returnReason")}
        </label>
        <select
          id={`reason-${orderId}`}
          name="reason"
          required
          className="mt-1 w-full rounded-(--radius-button) border border-brand-300 bg-paper px-3 py-2 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          {RETURN_REASONS.map((reason) => (
            <option key={reason} value={reason}>
              {t(`returnReasons.${reason}`)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`notes-${orderId}`} className="block text-xs font-medium uppercase tracking-wider text-brand-700">
          {t("returnNotes")}
        </label>
        <textarea
          id={`notes-${orderId}`}
          name="reasonNotes"
          rows={2}
          className="mt-1 w-full rounded-(--radius-button) border border-brand-300 bg-paper px-3 py-2 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </div>
      {state.error && <p className="text-xs text-danger">{t(state.error)}</p>}
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? t("submitting") : t("submitReturn")}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
