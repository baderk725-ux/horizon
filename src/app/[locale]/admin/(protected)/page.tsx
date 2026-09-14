import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/data/auth";
import { getAdminOrders } from "@/lib/data/admin/orders";
import { Link } from "@/i18n/navigation";

export default async function AdminDashboardPage() {
  const t = await getTranslations("admin");
  const to = await getTranslations("adminOrders");
  const [current, pending] = await Promise.all([
    getCurrentUser(),
    getAdminOrders({ status: "pending", page: 1 }),
  ]);

  return (
    <div>
      <h1 className="font-display text-display-sm text-brand-900">
        {t("dashboard")}
      </h1>
      <dl className="mt-8 max-w-md divide-y divide-brand-200 rounded-(--radius-card) border border-brand-200 bg-paper">
        <div className="flex items-center justify-between px-5 py-4">
          <dt className="text-sm text-brand-600">{t("signedInAs")}</dt>
          <dd className="text-sm font-medium text-brand-900">
            {current?.profile?.full_name ?? current?.email}
          </dd>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <dt className="text-sm text-brand-600">{t("staffRole")}</dt>
          <dd className="text-sm font-medium text-brand-900">
            {current?.profile?.staff_role}
          </dd>
        </div>
      </dl>

      <Link
        href="/admin/orders?status=pending"
        className="mt-6 flex max-w-md items-center justify-between rounded-(--radius-card) border border-brand-200 bg-paper px-5 py-4 hover:border-accent-500"
      >
        <span className="text-sm text-brand-700">{to("status.pending")} · {to("title")}</span>
        <span className="rounded-(--radius-pill) bg-accent-500 px-3 py-1 text-sm font-medium text-paper">
          {pending.total}
        </span>
      </Link>
    </div>
  );
}
