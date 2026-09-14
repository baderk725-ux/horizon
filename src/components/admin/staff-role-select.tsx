"use client";

import { useActionState, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { updateStaffRoleAction, demoteStaffAction, type StaffActionState } from "@/lib/actions/staff";
import { STAFF_ROLES } from "@/lib/validation/staff";
import { Button } from "@/components/ui/button";

const initialState: StaffActionState = { error: null };

export function StaffRoleSelect({
  profileId,
  currentStaffRole,
  isSelf,
}: {
  profileId: string;
  currentStaffRole: string;
  isSelf: boolean;
}) {
  const t = useTranslations("adminStaff");
  const router = useRouter();
  const [demoting, startDemoteTransition] = useTransition();
  const [demoteError, setDemoteError] = useState<string | null>(null);

  const action = updateStaffRoleAction.bind(null, profileId, currentStaffRole);
  const [state, formAction, pending] = useActionState(
    async (prev: StaffActionState, formData: FormData) => {
      const result = await action(prev, formData);
      if (!result.error) router.refresh();
      return result;
    },
    initialState,
  );

  function demote() {
    if (!window.confirm(t("confirmDemote"))) return;
    setDemoteError(null);
    startDemoteTransition(async () => {
      const result = await demoteStaffAction(profileId, currentStaffRole);
      if (result.error) setDemoteError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form action={formAction} className="flex items-center gap-2">
        <select
          name="staffRole"
          defaultValue={currentStaffRole}
          className="rounded-(--radius-button) border border-brand-300 bg-paper px-3 py-1.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          {STAFF_ROLES.map((role) => (
            <option key={role} value={role}>
              {t(`roles.${role}`)}
            </option>
          ))}
        </select>
        <Button type="submit" size="sm" variant="ghost" disabled={pending}>
          {pending ? t("saving") : t("save")}
        </Button>
      </form>
      {!isSelf && (
        <button
          type="button"
          disabled={demoting}
          onClick={demote}
          className="text-sm font-medium text-danger hover:underline disabled:opacity-50"
        >
          {t("removeStaffAccess")}
        </button>
      )}
      {state.error && <span className="w-full text-xs text-danger">{t(state.error)}</span>}
      {demoteError && <span className="w-full text-xs text-danger">{t(demoteError)}</span>}
    </div>
  );
}
