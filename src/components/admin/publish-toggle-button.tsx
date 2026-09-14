"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toggleProductPublishedAction } from "@/lib/actions/products";
import { clsx } from "clsx";

export function PublishToggleButton({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
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
          setError(null);
          startTransition(async () => {
            const result = await toggleProductPublishedAction(id, !isPublished);
            if (result.error) setError(result.error);
            else router.refresh();
          });
        }}
        className={clsx(
          "rounded-(--radius-pill) px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors disabled:opacity-50",
          isPublished
            ? "bg-brand-100 text-brand-700 hover:bg-brand-200"
            : "bg-accent-500 text-paper hover:bg-accent-600",
        )}
      >
        {isPublished ? t("unpublish") : t("publish")}
      </button>
      {error && <span className="text-xs text-danger">{t(error)}</span>}
    </div>
  );
}
