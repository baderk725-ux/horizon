"use client";

import { useTransition } from "react";
import { deleteProductAction } from "../actions";
import { AdminButton } from "../../_components/ui";

export function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <AdminButton
      type="button"
      variant="danger"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this product permanently? This cannot be undone.")) return;
        startTransition(() => deleteProductAction(productId));
      }}
    >
      {isPending ? "Deleting…" : "Delete Product"}
    </AdminButton>
  );
}
