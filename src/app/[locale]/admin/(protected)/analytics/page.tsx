import { getTranslations } from "next-intl/server";
import { getRevenueTrend, getOrderStatusBreakdown } from "@/lib/data/admin/analytics";
import { getReviewStats } from "@/lib/data/admin/reviews";
import { RevenueTrendChart } from "@/components/admin/revenue-trend-chart";

export default async function AdminAnalyticsPage() {
  const t = await getTranslations("adminAnalytics");
  const tOrders = await getTranslations("adminOrders");

  const [revenueTrend, statusBreakdown, reviewStats] = await Promise.all([
    getRevenueTrend(30),
    getOrderStatusBreakdown(),
    getReviewStats(),
  ]);

  const totalOrders = statusBreakdown.reduce((sum, s) => sum + s.count, 0);
  const maxStatusCount = Math.max(1, ...statusBreakdown.map((s) => s.count));

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <h2 className="font-display text-lg text-brand-900">{t("revenueTrend")}</h2>
        <p className="mt-1 text-xs text-brand-500">{t("last30Days")}</p>
        <div className="mt-4">
          <RevenueTrendChart points={revenueTrend} currency={tOrders("currency")} />
        </div>
      </section>

      <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <h2 className="font-display text-lg text-brand-900">{t("orderStatusBreakdown")}</h2>
        {totalOrders === 0 ? (
          <p className="mt-3 text-sm text-brand-500">{t("noOrders")}</p>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {statusBreakdown.map((s) => (
              <li key={s.status}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-700">{tOrders(`status.${s.status}`)}</span>
                  <span className="text-brand-900">{s.count}</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-(--radius-pill) bg-brand-100">
                  <div
                    className="h-full rounded-(--radius-pill) bg-accent-500"
                    style={{ width: `${(s.count / maxStatusCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <h2 className="font-display text-lg text-brand-900">{t("reviewStats")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-brand-500">{t("averageRating")}</p>
            <p className="mt-1 font-display text-xl text-brand-900">
              {reviewStats.averageRating !== null ? reviewStats.averageRating.toFixed(1) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-brand-500">{t("approvedReviews")}</p>
            <p className="mt-1 font-display text-xl text-brand-900">{reviewStats.approvedCount}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-brand-500">{t("pendingReviews")}</p>
            <p className="mt-1 font-display text-xl text-brand-900">{reviewStats.pendingCount}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
