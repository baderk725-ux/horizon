"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { setStaffSalaryAction, type PayrollActionState } from "@/lib/actions/payroll";
import { Button } from "@/components/ui/button";

const initialState: PayrollActionState = { error: null };

export function SalaryForm({ profileId, currentSalary }: { profileId: string; currentSalary: number | null }) {
  const t = useTranslations("adminPayroll");
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const action = setStaffSalaryAction.bind(null, profileId);
  const [state, formAction, pending] = useActionState(
    async (prev: PayrollActionState, formData: FormData) => {
      const result = await action(prev, formData);
      if (!result.error) {
        setEditing(false);
        router.refresh();
      }
      return result;
    },
    initialState,
  );

  if (!editing) {
    return (
      <button type="button" onClick={() => setEditing(true)} className="text-sm font-medium text-brand-700 hover:underline">
        {currentSalary === null ? t("setSalary") : t("editSalary")}
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input
        type="number"
        name="monthlySalary"
        step="0.01"
        min={0}
        defaultValue={currentSalary ?? ""}
        required
        className="w-28 rounded-(--radius-button) border border-brand-300 px-2 py-1 text-sm"
      />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : t("save")}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
        {t("cancel")}
      </Button>
      {state.error && <span className="w-full text-xs text-danger">{t(state.error)}</span>}
    </form>
  );
}
