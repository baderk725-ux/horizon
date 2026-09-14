"use client";

import { useActionState, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { updateThemeAction, type ThemeActionState } from "@/lib/actions/theme";
import { buildBrandScale, buildAccentScale } from "@/lib/theme/palette";
import { Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ThemeSettings } from "@/lib/data/theme";

const initialState: ThemeActionState = { error: null };

export function ThemeSettingsForm({ theme }: { theme: Pick<ThemeSettings, "primary_color" | "accent_color"> }) {
  const t = useTranslations("adminTheme");
  const [primaryColor, setPrimaryColor] = useState(theme.primary_color);
  const [accentColor, setAccentColor] = useState(theme.accent_color);
  const [state, formAction, pending] = useActionState(updateThemeAction, initialState);

  const brandScale = useMemo(() => buildBrandScale(primaryColor), [primaryColor]);
  const accentScale = useMemo(() => buildAccentScale(accentColor), [accentColor]);

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={t("primaryColor")} htmlFor="theme-primary">
          <div className="flex items-center gap-3">
            <input
              id="theme-primary"
              name="primaryColor"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="h-11 w-14 cursor-pointer rounded-(--radius-button) border border-brand-300 bg-paper"
            />
            <span className="font-mono text-sm text-brand-600">{primaryColor}</span>
          </div>
        </Field>
        <Field label={t("accentColor")} htmlFor="theme-accent">
          <div className="flex items-center gap-3">
            <input
              id="theme-accent"
              name="accentColor"
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-11 w-14 cursor-pointer rounded-(--radius-button) border border-brand-300 bg-paper"
            />
            <span className="font-mono text-sm text-brand-600">{accentColor}</span>
          </div>
        </Field>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-brand-500">{t("preview")}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Object.entries(brandScale).map(([step, hex]) => (
            <div key={step} className="text-center">
              <div className="h-10 w-10 rounded-(--radius-button) border border-brand-200" style={{ backgroundColor: hex }} />
              <span className="mt-1 block text-[10px] text-brand-400">{step}</span>
            </div>
          ))}
          {Object.entries(accentScale).map(([step, hex]) => (
            <div key={`accent-${step}`} className="text-center">
              <div className="h-10 w-10 rounded-(--radius-button) border border-brand-200" style={{ backgroundColor: hex }} />
              <span className="mt-1 block text-[10px] text-brand-400">A{step}</span>
            </div>
          ))}
        </div>
      </div>

      {state.error && <p className="text-sm text-danger">{t(state.error)}</p>}

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
