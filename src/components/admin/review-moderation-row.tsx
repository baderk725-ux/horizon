"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { approveReviewAction, deleteReviewAction } from "@/lib/actions/reviews";

export function ReviewModerationRow({ id, isApproved }: { id: string; isApproved: boolean }) {
  const t = useTranslations("adminReviews");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function approve() {
    startTransition(async () => {
      await approveReviewAction(id);
      router.refresh();
    });
  }

  function remove() {
    if (!window.confirm(t("deleteConfirm"))) return;
    startTransition(async () => {
      await deleteReviewAction(id);
      router.refresh();
    });
  }

  return (
    <div className="inline-flex items-center gap-4">
      {!isApproved && (
        <button type="button" disabled={pending} onClick={approve} className="text-sm font-medium text-brand-700 hover:underline disabled:opacity-50">
          {t("approve")}
        </button>
      )}
      <button type="button" disabled={pending} onClick={remove} className="text-sm font-medium text-danger hover:underline disabled:opacity-50">
        {t("reject")}
      </button>
    </div>
  );
}
