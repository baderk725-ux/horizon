"use client";

import { useActionState } from "react";
import { AdminButton, AdminField, AdminInput } from "../_components/ui";
import { changePasswordAction, type SettingsFormState } from "./actions";

const initialState: SettingsFormState = {};

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <AdminField label="New Password" hint="At least 8 characters">
        <AdminInput type="password" name="password" required minLength={8} autoComplete="new-password" />
      </AdminField>
      <AdminField label="Confirm New Password">
        <AdminInput type="password" name="confirmPassword" required minLength={8} autoComplete="new-password" />
      </AdminField>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.saved ? <p className="text-sm text-green-700">Password updated.</p> : null}
      <div>
        <AdminButton type="submit" disabled={pending}>
          {pending ? "Updating…" : "Update Password"}
        </AdminButton>
      </div>
    </form>
  );
}
