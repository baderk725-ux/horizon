"use client";

import { useActionState } from "react";
import type { EditorialSectionContent } from "@/lib/types";
import { AdminButton, AdminField, AdminInput, AdminTextarea } from "../_components/ui";
import { updateEditorialSectionAction, type HomepageFormState } from "./actions";

const initialState: HomepageFormState = {};

export function EditorialSectionForm({
  title,
  sectionKey,
  content,
}: {
  title: string;
  sectionKey: "featured_collection" | "brand_story" | "editorial";
  content: EditorialSectionContent;
}) {
  const action = updateEditorialSectionAction.bind(null, sectionKey);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div>
      <h2 className="mb-4 font-serif text-xl text-[#1a1714]">{title}</h2>
      <form action={formAction} className="flex flex-col gap-5">
        <AdminField label="Eyebrow">
          <AdminInput name="eyebrow" defaultValue={content.eyebrow} />
        </AdminField>
        <AdminField label="Heading">
          <AdminInput name="heading" defaultValue={content.heading} />
        </AdminField>
        <AdminField label="Description">
          <AdminTextarea name="description" rows={3} defaultValue={content.description} />
        </AdminField>
        <div className="grid gap-5 md:grid-cols-2">
          <AdminField label="Button Label">
            <AdminInput name="ctaLabel" defaultValue={content.ctaLabel} />
          </AdminField>
          <AdminField label="Button Link">
            <AdminInput name="ctaHref" defaultValue={content.ctaHref} />
          </AdminField>
        </div>
        {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        {state.saved ? <p className="text-sm text-green-700">Saved.</p> : null}
        <div>
          <AdminButton type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save Section"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
