"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { signUpAction, type AuthActionState } from "@/lib/actions/auth";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AuthActionState = { error: null };

export function SignUpForm() {
  const t = useTranslations("auth");
  const [success, setSuccess] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (prev: AuthActionState, formData: FormData) => {
      const result = await signUpAction(prev, formData);
      if (!result.error) setSuccess(true);
      return result;
    },
    initialState,
  );

  if (success) {
    return (
      <p className="rounded-(--radius-card) bg-brand-100 p-4 text-sm text-brand-800">
        {t("signUpSuccess")}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <Field label={t("fullName")} htmlFor="fullName">
        <Input id="fullName" name="fullName" type="text" autoComplete="name" required invalid={!!state.fieldErrors?.fullName} />
      </Field>
      <Field label={t("email")} htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required invalid={!!state.fieldErrors?.email} />
      </Field>
      <Field
        label={t("phone")}
        htmlFor="phone"
        error={state.fieldErrors?.phone ? t("invalid_phone") : undefined}
      >
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="079xxxxxxx"
          autoComplete="tel"
          required
          invalid={!!state.fieldErrors?.phone}
        />
      </Field>
      <Field label={t("password")} htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          invalid={!!state.fieldErrors?.password}
        />
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
