import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAdminStaffPayroll } from "@/lib/data/admin/payroll";
import { SalaryForm } from "@/components/admin/salary-form";

export default async function AdminPayrollPage() {
  const t = await getTranslations("adminPayroll");
  const tOrders = await getTranslations("adminOrders");
  const staff = await getAdminStaffPayroll();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <div className="overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
              <th className="px-5 py-3 text-start">{t("name")}</th>
              <th className="px-5 py-3 text-start">{t("role")}</th>
              <th className="px-5 py-3 text-start">{t("monthlySalary")}</th>
              <th className="px-5 py-3 text-end">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-200">
            {staff.map((member) => (
              <tr key={member.profileId}>
                <td className="px-5 py-3 font-medium text-brand-900">{member.fullName ?? member.email ?? "—"}</td>
                <td className="px-5 py-3 text-brand-700">{t(`roles.${member.staffRole}`)}</td>
                <td className="px-5 py-3 text-brand-700">
                  {member.monthlySalary !== null ? `${member.monthlySalary.toFixed(2)} ${tOrders("currency")}` : "—"}
                </td>
                <td className="px-5 py-3 text-end">
                  <div className="inline-flex items-center gap-4">
                    <SalaryForm profileId={member.profileId} currentSalary={member.monthlySalary} />
                    <Link href={`/admin/payroll/${member.profileId}`} className="text-sm font-medium text-brand-700 hover:underline">
                      {t("paymentHistory")}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
