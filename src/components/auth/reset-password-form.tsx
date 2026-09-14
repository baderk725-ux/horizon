"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { resetPasswordAction, type AuthActionState } from "@/lib/actions/auth";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AuthActionState = { error: null };

export function ResetPasswordForm({ redirectTo }: { redirectTo: string }) {
  const t = useTranslations("auth");
  const [state, formAction, pending] = useActionState(
    async (prev: AuthActionState, formData: FormData) => {
      const result = await resetPasswordAction(prev, formData);
      if (!result.error) window.location.assign(redirectTo);
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <Field label={t("newPassword")} htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
      </Field>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {t(state.error)}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? t("submitting") : t("updatePassword")}
      </Button>
    </form>
  );
}
