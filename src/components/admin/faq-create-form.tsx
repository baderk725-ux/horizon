"use client";

import { useActionState, useRef } from "react";
import { useTranslations } from "next-intl";
import { createFaqAction, type CmsActionState } from "@/lib/actions/cms";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: CmsActionState = { error: null };

export function FaqCreateForm({ nextSortOrder }: { nextSortOrder: number }) {
  const t = useTranslations("adminContent");
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    async (prev: CmsActionState, formData: FormData) => {
      const result = await createFaqAction(prev, formData);
      if (!result.error) formRef.current?.reset();
      return result;
    },
    initialState,
  );

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-(--radius-card) border border-brand-200 border-dashed p-4">
      <p className="text-sm font-medium text-brand-900">{t("addFaq")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t("questionEn")} htmlFor="new-faq-qen">
          <Input id="new-faq-qen" name="questionEn" required />
        </Field>
        <Field label={t("questionAr")} htmlFor="new-faq-qar">
          <Input id="new-faq-qar" name="questionAr" dir="rtl" required />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t("answerEn")} htmlFor="new-faq-aen">
          <textarea
            id="new-faq-aen"
            name="answerEn"
            rows={3}
            required
            className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </Field>
        <Field label={t("answerAr")} htmlFor="new-faq-aar">
          <textarea
            id="new-faq-aar"
            name="answerAr"
            dir="rtl"
            rows={3}
            required
            className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </Field>
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <Field label={t("sortOrder")} htmlFor="new-faq-sort">
          <Input id="new-faq-sort" name="sortOrder" type="number" min={0} defaultValue={nextSortOrder} className="w-24" />
        </Field>
        <label className="flex items-center gap-2 pb-3 text-sm text-brand-700">
          <input type="checkbox" name="isActive" defaultChecked />
          {t("active")}
        </label>
      </div>

      {state.error && <p className="text-sm text-danger">{t(state.error)}</p>}

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : t("addFaq")}
      </Button>
    </form>
  );
}
