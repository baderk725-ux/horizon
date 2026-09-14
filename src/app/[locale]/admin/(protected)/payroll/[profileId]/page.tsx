import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getStaffPaymentHistory } from "@/lib/data/admin/payroll";
import { PayrollPaymentForm } from "@/components/admin/payroll-payment-form";

export default async function AdminPayrollDetailPage(props: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await props.params;
  const supabase = await createClient();
  const { data: staff } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("id", profileId)
    .eq("role", "admin")
    .maybeSingle();
  if (!staff) notFound();

  const t = await getTranslations("adminPayroll");
  const tOrders = await getTranslations("adminOrders");
  const payments = await getStaffPaymentHistory(profileId);

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{staff.full_name ?? staff.email}</h1>
        <p className="mt-1 text-sm text-brand-500">{t("paymentHistory")}</p>
      </div>

      <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <PayrollPaymentForm profileId={profileId} />
      </section>

      {payments.length === 0 ? (
        <p className="text-sm text-brand-500">{t("noPayments")}</p>
      ) : (
        <div className="overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="px-5 py-3 text-start">{t("period")}</th>
                <th className="px-5 py-3 text-start">{t("amount")}</th>
                <th className="px-5 py-3 text-start">{t("paymentDate")}</th>
                <th className="px-5 py-3 text-start">{t("notes")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-5 py-3 text-brand-900">{payment.period}</td>
                  <td className="px-5 py-3 text-brand-700">
                    {payment.amount.toFixed(2)} {tOrders("currency")}
                  </td>
                  <td className="px-5 py-3 text-brand-700">{payment.payment_date}</td>
                  <td className="px-5 py-3 text-brand-500">{payment.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
