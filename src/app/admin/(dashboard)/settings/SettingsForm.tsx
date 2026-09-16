"use client";

import { useActionState } from "react";
import type { SiteSettings } from "@/lib/types";
import { AdminButton, AdminField, AdminInput, AdminTextarea } from "../_components/ui";
import { updateSettingsAction, type SettingsFormState } from "./actions";

const initialState: SettingsFormState = {};

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(updateSettingsAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <AdminField label="Site Name">
        <AdminInput name="siteName" defaultValue={settings.siteName} />
      </AdminField>

      <div className="grid gap-6 md:grid-cols-2">
        <AdminField label="Default SEO Title">
          <AdminInput name="seoTitle" defaultValue={settings.seoTitle} />
        </AdminField>
        <AdminField label="Default Meta Description">
          <AdminInput name="seoDescription" defaultValue={settings.seoDescription} />
        </AdminField>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AdminField label="Contact Email">
          <AdminInput type="email" name="contactEmail" defaultValue={settings.contactEmail} />
        </AdminField>
        <AdminField label="Contact Phone">
          <AdminInput name="contactPhone" defaultValue={settings.contactPhone} />
        </AdminField>
      </div>

      <AdminField label="Studio Address">
        <AdminTextarea name="address" rows={2} defaultValue={settings.address} />
      </AdminField>

      <div className="grid gap-6 md:grid-cols-3">
        <AdminField label="Instagram URL">
          <AdminInput name="instagramUrl" defaultValue={settings.instagramUrl} />
        </AdminField>
        <AdminField label="Facebook URL">
          <AdminInput name="facebookUrl" defaultValue={settings.facebookUrl} />
        </AdminField>
        <AdminField label="TikTok URL">
          <AdminInput name="tiktokUrl" defaultValue={settings.tiktokUrl} />
        </AdminField>
      </div>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.saved ? <p className="text-sm text-green-700">Saved.</p> : null}

      <div>
        <AdminButton type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save Settings"}
        </AdminButton>
      </div>
    </form>
  );
}
