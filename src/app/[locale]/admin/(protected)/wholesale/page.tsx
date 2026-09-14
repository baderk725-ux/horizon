import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getAdminWholesaleApplications,
  type WholesaleApplicationStatus,
} from "@/lib/data/admin/wholesale";

const STATUSES: WholesaleApplicationStatus[] = ["pending", "approved", "rejected"];

export default async function AdminWholesalePage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("adminWholesale");
  const locale = await getLocale();

  const status = (STATUSES as string[]).includes(searchParams.status ?? "")
    ? (searchParams.status as WholesaleApplicationStatus)
    : undefined;

  const applications = await getAdminWholesaleApplications({ status });

  const tabs: { key: string; label: string }[] = [
    { key: "all", label: t("allApplications") },
    ...STATUSES.map((s) => ({ key: s, label: t(`status.${s}`) })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const href = `/${locale}/admin/wholesale${tab.key !== "all" ? `?status=${tab.key}` : ""}`;
          const active = tab.key === "all" ? !status : status === tab.key;
          return (
            <a
              key={tab.key}
              href={href}
              className={`rounded-(--radius-pill) px-4 py-1.5 text-xs font-medium uppercase tracking-wider ${
                active ? "bg-brand-900 text-paper" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>

      {applications.length === 0 ? (
        <p className="text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="px-5 py-3 text-start">{t("company")}</th>
                <th className="px-5 py-3 text-start">{t("contact")}</th>
                <th className="px-5 py-3 text-start">{t("status.label")}</th>
                <th className="px-5 py-3 text-start">{t("submitted")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-5 py-3">
                    <Link href={`/admin/wholesale/${app.id}`} className="font-medium text-brand-900 hover:underline">
                      {app.company_name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-brand-700">
                    {app.full_name} · {app.phone}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-(--radius-pill) px-2.5 py-0.5 text-xs ${
                        app.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : app.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {t(`status.${app.status}`)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-brand-500">
                    {new Intl.DateTimeFormat("en-JO", { dateStyle: "medium" }).format(new Date(app.created_at))}
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
