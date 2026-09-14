"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { updateSiteContentAction, type CmsActionState } from "@/lib/actions/cms";
import type { SiteContentRow } from "@/lib/data/cms";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: CmsActionState = { error: null };

export function SiteContentForm({ rows }: { rows: SiteContentRow[] }) {
  const t = useTranslations("adminContent");
  const [state, formAction, pending] = useActionState(updateSiteContentAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-5">
        {rows.map((row) => (
          <div key={row.key} className="rounded-(--radius-card) border border-brand-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-brand-500">
              {t.has(`fields.${row.key}`) ? t(`fields.${row.key}`) : row.key}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label={t("valueEn")} htmlFor={`content-${row.key}-en`}>
                <Input
                  id={`content-${row.key}-en`}
                  name={`content:${row.key}:en`}
                  defaultValue={row.value_en ?? ""}
                />
              </Field>
              <Field label={t("valueAr")} htmlFor={`content-${row.key}-ar`}>
                <Input
                  id={`content-${row.key}-ar`}
                  name={`content:${row.key}:ar`}
                  dir="rtl"
                  defaultValue={row.value_ar ?? ""}
                />
              </Field>
            </div>
          </div>
        ))}
      </div>

      {state.error && <p className="text-sm text-danger">{t(state.error)}</p>}

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
