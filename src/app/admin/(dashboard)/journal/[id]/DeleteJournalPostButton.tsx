"use client";

import { useTransition } from "react";
import { deleteJournalPostAction } from "../actions";
import { AdminButton } from "../../_components/ui";

export function DeleteJournalPostButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <AdminButton
      type="button"
      variant="danger"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this journal post permanently?")) return;
        startTransition(() => deleteJournalPostAction(postId));
      }}
    >
      {isPending ? "Deleting…" : "Delete Post"}
    </AdminButton>
  );
}
