"use client";

import { useActionState } from "react";
import type { JournalPost, PlaceholderIcon } from "@/lib/types";
import { AdminButton, AdminCheckboxLabel, AdminField, AdminInput, AdminTextarea } from "../_components/ui";
import { createJournalPostAction, updateJournalPostAction, type JournalFormState } from "./actions";

const ICONS: PlaceholderIcon[] = [
  "kitchen",
  "macrame",
  "rugs",
  "home-decor",
  "tableware",
  "textiles",
  "gifts",
];

const initialState: JournalFormState = {};

export function JournalForm({ post }: { post?: JournalPost }) {
  const action = post ? updateJournalPostAction.bind(null, post.id!) : createJournalPostAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <AdminField label="Title">
          <AdminInput name="title" required defaultValue={post?.title} />
        </AdminField>
        <AdminField label="Slug" hint="Used in the storefront URL, e.g. /journal/your-slug">
          <AdminInput name="slug" required defaultValue={post?.slug} />
        </AdminField>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <AdminField label="Category Label" hint="e.g. Kitchen, Craft, Interiors">
          <AdminInput name="category" defaultValue={post?.category} />
        </AdminField>
        <AdminField label="Published Date">
          <AdminInput type="date" name="publishedAt" defaultValue={post?.date} />
        </AdminField>
        <AdminField label="Placeholder Icon">
          <select
            name="placeholderIcon"
            defaultValue={post?.image ?? "home-decor"}
            className="border border-[#e2d8c8] bg-white px-3 py-2.5 text-sm text-[#1a1714] focus:border-[#1a1714] focus:outline-none"
          >
            {ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </AdminField>
      </div>

      <AdminField label="Excerpt" hint="Shown on the Journal listing page">
        <AdminTextarea name="excerpt" rows={2} defaultValue={post?.excerpt} />
      </AdminField>

      <AdminField label="Content" hint="Separate paragraphs with a blank line">
        <AdminTextarea name="content" rows={10} defaultValue={post?.content.join("\n\n")} />
      </AdminField>

      <AdminCheckboxLabel>
        <input type="checkbox" name="isPublished" defaultChecked={post?.isPublished ?? true} /> Published
      </AdminCheckboxLabel>

      <div className="border-t border-[#e2d8c8] pt-6">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-[#6b5c48]">SEO</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <AdminField label="SEO Title" hint="Falls back to the post title">
            <AdminInput name="seoTitle" defaultValue={post?.seoTitle ?? ""} />
          </AdminField>
          <AdminField label="Meta Description" hint="Falls back to the excerpt">
            <AdminInput name="seoDescription" defaultValue={post?.seoDescription ?? ""} />
          </AdminField>
        </div>
      </div>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}

      <div>
        <AdminButton type="submit" disabled={pending}>
          {pending ? "Saving…" : post ? "Save Changes" : "Publish Post"}
        </AdminButton>
      </div>
    </form>
  );
}
