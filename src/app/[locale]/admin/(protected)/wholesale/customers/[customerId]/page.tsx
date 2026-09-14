import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getWholesaleCustomerLedger } from "@/lib/data/admin/wholesale";
import { WholesaleChargeForm } from "@/components/admin/wholesale-charge-form";
import { WholesalePaymentForm } from "@/components/admin/wholesale-payment-form";

export default async function AdminWholesaleLedgerPage(props: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await props.params;
  const supabase = await createClient();
  const { data: customer } = await supabase
    .from("profiles")
    .select("id, full_name, company_name, email, phone")
    .eq("id", customerId)
    .eq("role", "wholesale_customer")
    .maybeSingle();

  if (!customer) notFound();

  const t = await getTranslations("adminWholesale");
  const tOrders = await getTranslations("adminOrders");
  const { charges, payments } = await getWholesaleCustomerLedger(customerId);
  const openCharges = charges.filter((c) => c.status !== "paid");
  const dateFormatter = new Intl.DateTimeFormat("en-JO", { dateStyle: "medium" });

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{customer.company_name ?? customer.full_name}</h1>
        <p className="mt-1 text-sm text-brand-500">
          {customer.full_name} · {customer.phone}
        </p>
      </div>

      <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <h2 className="font-display text-lg text-brand-900">{t("charges")}</h2>
        <div className="mt-4">
          <WholesaleChargeForm customerId={customerId} />
        </div>
        {charges.length === 0 ? (
          <p className="mt-4 text-sm text-brand-500">{t("noCharges")}</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="py-2 text-start">{t("chargeDescription")}</th>
                <th className="py-2 text-start">{t("amount")}</th>
                <th className="py-2 text-start">{t("dueDate")}</th>
                <th className="py-2 text-start">{t("status.label")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {charges.map((charge) => (
                <tr key={charge.id}>
                  <td className="py-2 text-brand-900">{charge.description ?? "—"}</td>
                  <td className="py-2 text-brand-700">
                    {charge.amount.toFixed(2)} {tOrders("currency")}
                  </td>
                  <td className="py-2 text-brand-700">{dateFormatter.format(new Date(charge.due_date))}</td>
                  <td className="py-2">
                    <span
                      className={`rounded-(--radius-pill) px-2.5 py-0.5 text-xs ${
                        charge.status === "paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {t(`chargeStatus.${charge.status}`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <h2 className="font-display text-lg text-brand-900">{t("payments")}</h2>
        <div className="mt-4">
          <WholesalePaymentForm customerId={customerId} openCharges={openCharges} />
        </div>
        {payments.length === 0 ? (
          <p className="mt-4 text-sm text-brand-500">{t("noPayments")}</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                <th className="py-2 text-start">{t("amount")}</th>
                <th className="py-2 text-start">{t("method")}</th>
                <th className="py-2 text-start">{t("paymentDate")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="py-2 text-brand-900">
                    {payment.amount.toFixed(2)} {tOrders("currency")}
                  </td>
                  <td className="py-2 text-brand-700">{payment.method ?? "—"}</td>
                  <td className="py-2 text-brand-700">{dateFormatter.format(new Date(payment.payment_date))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
