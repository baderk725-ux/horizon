import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAdminCustomers } from "@/lib/data/admin/customers";

export default async function AdminCustomersPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("adminCustomers");
  const locale = await getLocale();

  const { customers, total, page, pageCount } = await getAdminCustomers({
    search: searchParams.q,
    page: searchParams.page ? Number(searchParams.page) : 1,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <form className="max-w-sm">
        <input
          type="search"
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder={t("search")}
          className="w-full rounded-(--radius-button) border border-brand-300 bg-paper px-4 py-2.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </form>

      <p className="text-sm text-brand-500">{t("resultCount", { count: total })}</p>

      {customers.length === 0 ? (
        <p className="text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="px-5 py-3 text-start">{t("name")}</th>
                <th className="px-5 py-3 text-start">{t("phone")}</th>
                <th className="px-5 py-3 text-start">{t("email")}</th>
                <th className="px-5 py-3 text-start">{t("type")}</th>
                <th className="px-5 py-3 text-start">{t("joined")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {customers.map((customer) => (
                <tr key={`${customer.type}:${customer.id}`}>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/customers/${customer.id}?type=${customer.type}`}
                      className="font-medium text-brand-900 hover:underline"
                    >
                      {customer.fullName ?? "—"}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-brand-700">{customer.phone ?? "—"}</td>
                  <td className="px-5 py-3 text-brand-700">{customer.email ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-(--radius-pill) px-2.5 py-0.5 text-xs ${
                        customer.type === "registered"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-brand-200 text-brand-700"
                      }`}
                    >
                      {customer.type === "registered" ? t("registered") : t("manual")}
                    </span>
                    {customer.wholesaleStatus === "approved" && (
                      <span className="ms-2 rounded-(--radius-pill) bg-green-100 px-2.5 py-0.5 text-xs text-green-800">
                        {t("wholesale")}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-brand-500">
                    {new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-JO", {
                      dateStyle: "medium",
                    }).format(new Date(customer.createdAt))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageCount > 1 && (
        <nav className="flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams();
            if (searchParams.q) params.set("q", searchParams.q);
            if (p > 1) params.set("page", String(p));
            const href = `/${locale}/admin/customers${params.toString() ? `?${params}` : ""}`;
            return (
              <a
                key={p}
                href={href}
                className={`flex h-9 w-9 items-center justify-center rounded-(--radius-button) text-sm ${
                  p === page ? "bg-brand-900 text-paper" : "text-brand-700 hover:bg-brand-100"
                }`}
              >
                {p}
              </a>
            );
          })}
        </nav>
      )}
    </div>
  );
}
