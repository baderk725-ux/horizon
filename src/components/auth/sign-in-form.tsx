"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { signInAction, type AuthActionState } from "@/lib/actions/auth";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AuthActionState = { error: null };

export function SignInForm({
  onSuccessRedirect,
}: {
  onSuccessRedirect: string;
}) {
  const t = useTranslations("auth");
  const [state, formAction, pending] = useActionState(
    async (prev: AuthActionState, formData: FormData) => {
      const result = await signInAction(prev, formData);
      if (!result.error) {
        window.location.assign(onSuccessRedirect);
      }
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <Field label={t("email")} htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label={t("password")} htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {t(state.error)}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
