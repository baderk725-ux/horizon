"use client";

import { useTransition } from "react";
import { deleteCategoryAction } from "../actions";
import { AdminButton } from "../../_components/ui";

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <AdminButton
      type="button"
      variant="danger"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this category? Products in it will become uncategorized.")) return;
        startTransition(() => deleteCategoryAction(categoryId));
      }}
    >
      {isPending ? "Deleting…" : "Delete Category"}
    </AdminButton>
  );
}
