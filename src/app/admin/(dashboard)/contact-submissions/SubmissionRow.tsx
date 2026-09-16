"use client";

import { useTransition } from "react";
import type { ContactSubmission } from "@/lib/types";
import { toggleReadAction, deleteSubmissionAction } from "./actions";

export function SubmissionRow({ submission }: { submission: ContactSubmission }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr className={`border-b border-[#f0e9dc] last:border-0 ${submission.isRead ? "" : "bg-[#faf6ee]"}`}>
      <td className="px-4 py-3 align-top">
        <p className="font-medium text-[#1a1714]">{submission.name}</p>
        <p className="text-xs text-[#9a8b73]">{submission.email}</p>
      </td>
      <td className="px-4 py-3 align-top text-[#6b5c48]">{submission.subject || "—"}</td>
      <td className="max-w-sm px-4 py-3 align-top text-[#6b5c48]">{submission.message}</td>
      <td className="px-4 py-3 align-top text-xs text-[#9a8b73]">
        {new Date(submission.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 align-top text-right">
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => toggleReadAction(submission.id, !submission.isRead))}
            className="text-xs uppercase tracking-[0.08em] text-[#1a1714] underline underline-offset-4"
          >
            {submission.isRead ? "Mark Unread" : "Mark Read"}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (confirm("Delete this submission?")) startTransition(() => deleteSubmissionAction(submission.id));
            }}
            className="text-xs uppercase tracking-[0.08em] text-red-700 underline underline-offset-4"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
