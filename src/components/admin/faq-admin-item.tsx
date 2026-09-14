"use client";

import { useActionState, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { updateFaqAction, deleteFaqAction, type CmsActionState } from "@/lib/actions/cms";
import type { Faq } from "@/lib/data/cms";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: CmsActionState = { error: null };

export function FaqAdminItem({ faq }: { faq: Faq }) {
  const t = useTranslations("adminContent");
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const action = updateFaqAction.bind(null, faq.id);
  const [state, formAction, formPending] = useActionState(
    async (prev: CmsActionState, formData: FormData) => {
      const result = await action(prev, formData);
      if (!result.error) setEditing(false);
      return result;
    },
    initialState,
  );

  function remove() {
    if (!window.confirm(t("deleteConfirm"))) return;
    startTransition(async () => {
      await deleteFaqAction(faq.id);
      router.refresh();
    });
  }

  if (!editing) {
    return (
      <div className="rounded-(--radius-card) border border-brand-200 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium text-brand-900">{faq.question_en}</p>
            <p className="mt-0.5 text-sm text-brand-600" dir="rtl">
              {faq.question_ar}
            </p>
            <p className="mt-2 text-xs text-brand-500">
              {t("sortOrder")}: {faq.sort_order} ·{" "}
              {faq.is_active ? t("active") : t("inactive")}
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm font-medium text-brand-700 hover:underline"
            >
              {t("edit")}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={remove}
              className="text-sm font-medium text-danger hover:underline disabled:opacity-50"
            >
              {t("delete")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-(--radius-card) border border-brand-300 bg-paper-muted p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t("questionEn")} htmlFor={`faq-${faq.id}-qen`}>
          <Input id={`faq-${faq.id}-qen`} name="questionEn" defaultValue={faq.question_en} required />
        </Field>
        <Field label={t("questionAr")} htmlFor={`faq-${faq.id}-qar`}>
          <Input id={`faq-${faq.id}-qar`} name="questionAr" dir="rtl" defaultValue={faq.question_ar} required />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t("answerEn")} htmlFor={`faq-${faq.id}-aen`}>
          <textarea
            id={`faq-${faq.id}-aen`}
            name="answerEn"
            rows={3}
            required
            defaultValue={faq.answer_en}
            className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </Field>
        <Field label={t("answerAr")} htmlFor={`faq-${faq.id}-aar`}>
          <textarea
            id={`faq-${faq.id}-aar`}
            name="answerAr"
            dir="rtl"
            rows={3}
            required
            defaultValue={faq.answer_ar}
            className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </Field>
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <Field label={t("sortOrder")} htmlFor={`faq-${faq.id}-sort`}>
          <Input
            id={`faq-${faq.id}-sort`}
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={faq.sort_order}
            className="w-24"
          />
        </Field>
        <label className="flex items-center gap-2 pb-3 text-sm text-brand-700">
          <input type="checkbox" name="isActive" defaultChecked={faq.is_active} />
          {t("active")}
        </label>
      </div>

      {state.error && <p className="text-sm text-danger">{t(state.error)}</p>}

      <div className="flex gap-3">
        <Button type="submit" size="sm" disabled={formPending}>
          {formPending ? t("saving") : t("save")}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
