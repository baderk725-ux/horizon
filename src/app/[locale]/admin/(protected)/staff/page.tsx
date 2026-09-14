import { getTranslations } from "next-intl/server";
import { getCurrentUser, isSuperAdmin } from "@/lib/data/auth";
import { getAdminStaff } from "@/lib/data/admin/staff";
import { StaffRoleSelect } from "@/components/admin/staff-role-select";
import { PromoteStaffForm } from "@/components/admin/promote-staff-form";

export default async function AdminStaffPage() {
  const t = await getTranslations("adminStaff");
  const current = await getCurrentUser();

  if (!isSuperAdmin(current?.profile ?? null)) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-4 text-sm text-brand-600">{t("superAdminOnly")}</p>
      </div>
    );
  }

  const staff = await getAdminStaff();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <h2 className="font-display text-lg text-brand-900">{t("grantStaffAccess")}</h2>
        <p className="mt-1 text-xs text-brand-500">{t("grantStaffAccessHint")}</p>
        <div className="mt-4">
          <PromoteStaffForm />
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg text-brand-900">{t("currentStaff")}</h2>
        <div className="mt-4 overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="px-5 py-3 text-start">{t("name")}</th>
                <th className="px-5 py-3 text-start">{t("email")}</th>
                <th className="px-5 py-3 text-start">{t("role")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {staff.map((member) => (
                <tr key={member.id}>
                  <td className="px-5 py-3 text-brand-900">{member.full_name ?? "—"}</td>
                  <td className="px-5 py-3 text-brand-700">{member.email ?? "—"}</td>
                  <td className="px-5 py-3">
                    <StaffRoleSelect
                      profileId={member.id}
                      currentStaffRole={member.staff_role}
                      isSelf={member.id === current?.userId}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
