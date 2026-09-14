"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { updateStoreSettingsAction, type SettingsActionState } from "@/lib/actions/settings";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { StoreSettings } from "@/lib/data/settings";

const initialState: SettingsActionState = { error: null };

export function StoreSettingsForm({ settings }: { settings: StoreSettings }) {
  const t = useTranslations("adminSettings");
  const [state, formAction, pending] = useActionState(updateStoreSettingsAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("supportEmail")} htmlFor="settings-supportEmail">
          <Input
            id="settings-supportEmail"
            name="supportEmail"
            type="email"
            defaultValue={settings.support_email ?? ""}
          />
        </Field>
        <Field label={t("supportPhone")} htmlFor="settings-supportPhone">
          <Input id="settings-supportPhone" name="supportPhone" defaultValue={settings.support_phone ?? ""} />
        </Field>
      </div>

      <Field label={t("whatsappNumber")} htmlFor="settings-whatsappNumber">
        <Input
          id="settings-whatsappNumber"
          name="whatsappNumber"
          placeholder={t("whatsappPlaceholder")}
          defaultValue={settings.whatsapp_number ?? ""}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={t("instagramUrl")} htmlFor="settings-instagramUrl">
          <Input id="settings-instagramUrl" name="instagramUrl" type="url" defaultValue={settings.instagram_url ?? ""} />
        </Field>
        <Field label={t("facebookUrl")} htmlFor="settings-facebookUrl">
          <Input id="settings-facebookUrl" name="facebookUrl" type="url" defaultValue={settings.facebook_url ?? ""} />
        </Field>
        <Field label={t("tiktokUrl")} htmlFor="settings-tiktokUrl">
          <Input id="settings-tiktokUrl" name="tiktokUrl" type="url" defaultValue={settings.tiktok_url ?? ""} />
        </Field>
      </div>

      {state.error && <p className="text-sm text-danger">{t(state.error)}</p>}

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
