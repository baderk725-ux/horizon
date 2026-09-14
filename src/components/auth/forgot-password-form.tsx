"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { requestPasswordResetAction, type AuthActionState } from "@/lib/actions/auth";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AuthActionState = { error: null };

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const [submitted, setSubmitted] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (prev: AuthActionState, formData: FormData) => {
      const result = await requestPasswordResetAction(prev, formData);
      if (!result.error) setSubmitted(true);
      return result;
    },
    initialState,
  );

  if (submitted) {
    return <p className="text-center text-sm text-brand-700">{t("resetEmailSent")}</p>;
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <Field label={t("email")} htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {t(state.error)}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? t("submitting") : t("sendResetLink")}
      </Button>
    </form>
  );
}
