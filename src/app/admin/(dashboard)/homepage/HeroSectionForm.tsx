"use client";

import { useActionState } from "react";
import type { HeroContent } from "@/lib/types";
import { AdminButton, AdminField, AdminInput } from "../_components/ui";
import { updateHeroAction, type HomepageFormState } from "./actions";

const initialState: HomepageFormState = {};

export function HeroSectionForm({ content }: { content: HeroContent }) {
  const [state, formAction, pending] = useActionState(updateHeroAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <AdminField label="Eyebrow">
        <AdminInput name="eyebrow" defaultValue={content.eyebrow} />
      </AdminField>
      <AdminField label="Heading">
        <AdminInput name="heading" defaultValue={content.heading} />
      </AdminField>
      <div className="grid gap-5 md:grid-cols-2">
        <AdminField label="Primary Button Label">
          <AdminInput name="primaryCta" defaultValue={content.primaryCta} />
        </AdminField>
        <AdminField label="Primary Button Link">
          <AdminInput name="primaryHref" defaultValue={content.primaryHref} />
        </AdminField>
        <AdminField label="Secondary Button Label">
          <AdminInput name="secondaryCta" defaultValue={content.secondaryCta} />
        </AdminField>
        <AdminField label="Secondary Button Link">
          <AdminInput name="secondaryHref" defaultValue={content.secondaryHref} />
        </AdminField>
      </div>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.saved ? <p className="text-sm text-green-700">Saved.</p> : null}
      <div>
        <AdminButton type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save Hero"}
        </AdminButton>
      </div>
    </form>
  );
}
