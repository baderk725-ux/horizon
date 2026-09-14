import { getTranslations, getLocale } from "next-intl/server";
import { getAdminReviews } from "@/lib/data/admin/reviews";
import { ReviewModerationRow } from "@/components/admin/review-moderation-row";

export default async function AdminReviewsPage(props: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("adminReviews");
  const locale = await getLocale();
  const pendingOnly = searchParams.filter !== "all";

  const reviews = await getAdminReviews({ pendingOnly });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={`/${locale}/admin/reviews`}
          className={`rounded-(--radius-pill) px-4 py-1.5 text-xs font-medium uppercase tracking-wider ${
            pendingOnly ? "bg-brand-900 text-paper" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
          }`}
        >
          {t("pending")}
        </a>
        <a
          href={`/${locale}/admin/reviews?filter=all`}
          className={`rounded-(--radius-pill) px-4 py-1.5 text-xs font-medium uppercase tracking-wider ${
            !pendingOnly ? "bg-brand-900 text-paper" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
          }`}
        >
          {t("all")}
        </a>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="px-5 py-3 text-start">{t("product")}</th>
                <th className="px-5 py-3 text-start">{t("rating")}</th>
                <th className="px-5 py-3 text-start">{t("comment")}</th>
                <th className="px-5 py-3 text-start">{t("status")}</th>
                <th className="px-5 py-3 text-end">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td className="px-5 py-3 text-brand-900">
                    {review.product ? (locale === "ar" ? review.product.name_ar : review.product.name_en) : "—"}
                  </td>
                  <td className="px-5 py-3 text-brand-700">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </td>
                  <td className="px-5 py-3 text-brand-700">{review.comment ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-(--radius-pill) px-2.5 py-0.5 text-xs ${
                        review.is_approved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {review.is_approved ? t("approved") : t("pendingStatus")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-end">
                    <ReviewModerationRow id={review.id} isApproved={review.is_approved} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
