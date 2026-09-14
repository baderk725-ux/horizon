"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { deleteProductAction } from "@/lib/actions/products";

export function DeleteProductButton({ id }: { id: string }) {
  const t = useTranslations("adminProducts");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(t("deleteConfirm"))) return;
          setError(null);
          startTransition(async () => {
            const result = await deleteProductAction(id);
            if (result.error) setError(result.error);
            else router.refresh();
          });
        }}
        className="text-sm font-medium text-danger hover:underline disabled:opacity-50"
      >
        {t("delete")}
      </button>
      {error && <span className="text-xs text-danger">{t(error)}</span>}
    </div>
  );
}
