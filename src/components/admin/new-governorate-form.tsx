"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createGovernorateAction, type ShippingActionState } from "@/lib/actions/shipping";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: ShippingActionState = { error: null };

export function NewGovernorateForm() {
  const t = useTranslations("adminShipping");
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (prev: ShippingActionState, formData: FormData) => {
      const result = await createGovernorateAction(prev, formData);
      if (!result.error) router.refresh();
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-3 sm:items-end">
      <Field label={t("nameEn")} htmlFor="gov-nameEn">
        <Input id="gov-nameEn" name="nameEn" required />
      </Field>
      <Field label={t("nameAr")} htmlFor="gov-nameAr">
        <Input id="gov-nameAr" name="nameAr" dir="rtl" required />
      </Field>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : t("addGovernorate")}
      </Button>
      {state.error && <p className="text-sm text-danger sm:col-span-3">{t(state.error)}</p>}
    </form>
  );
}
