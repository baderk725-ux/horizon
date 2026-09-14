"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { submitReviewAction, type ReviewActionState } from "@/lib/actions/reviews";

const initialState: ReviewActionState = { error: null };

export function ReviewForm({ productId, productSlug }: { productId: string; productSlug: string }) {
  const t = useTranslations("product");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const action = submitReviewAction.bind(null, productId, productSlug);
  const [state, formAction, pending] = useActionState(
    async (prev: ReviewActionState, formData: FormData) => {
      const result = await action(prev, formData);
      if (!result.error) setSubmitted(true);
      return result;
    },
    initialState,
  );

  if (submitted) {
    return (
      <p className="mt-6 max-w-sm rounded-(--radius-card) border border-brand-200 bg-paper-muted p-4 text-sm text-brand-700">
        {t("reviewSubmitted")}
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-6 max-w-sm space-y-3 rounded-(--radius-card) border border-brand-200 bg-paper-muted p-4">
      <p className="text-sm font-medium text-brand-900">{t("leaveReview")}</p>
      <div>
        <label htmlFor="review-rating" className="block text-xs font-medium uppercase tracking-wider text-brand-700">
          {t("rating")}
        </label>
        <select
          id="review-rating"
          name="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1 w-full rounded-(--radius-button) border border-brand-300 bg-paper px-3 py-2 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {"★".repeat(n)}
              {"☆".repeat(5 - n)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="review-comment" className="block text-xs font-medium uppercase tracking-wider text-brand-700">
          {t("comment")}
        </label>
        <textarea
          id="review-comment"
          name="comment"
          rows={3}
          className="mt-1 w-full rounded-(--radius-button) border border-brand-300 bg-paper px-3 py-2 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </div>
      {state.error && <p className="text-xs text-danger">{t(state.error)}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-(--radius-button) bg-brand-900 px-4 py-2 text-sm font-medium text-paper hover:bg-brand-800 disabled:opacity-50"
      >
        {pending ? t("submitting") : t("submitReview")}
      </button>
    </form>
  );
}
