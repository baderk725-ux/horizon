import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/data/auth";

export default async function AdminDashboardPage() {
  const t = await getTranslations("admin");
  const current = await getCurrentUser();

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
      <p className="mt-8 max-w-md text-sm text-brand-500">
        Products, orders, and the rest of the admin console are being built
        next, phase by phase.
      </p>
    </div>
  );
}
