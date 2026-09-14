import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAdminCustomerById } from "@/lib/data/admin/customers";
import { ManualCustomerEditForm } from "@/components/admin/manual-customer-edit-form";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import type { OrderStatus } from "@/lib/orders/status";

export default async function AdminCustomerDetailPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { id } = await props.params;
  const { type } = await props.searchParams;
  const customerType = type === "manual" ? "manual" : "registered";

  const customer = await getAdminCustomerById(id, customerType);
  if (!customer) notFound();

  const t = await getTranslations("adminCustomers");
  const tOrders = await getTranslations("adminOrders");
  const locale = await getLocale();
  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-JO", {
    dateStyle: "medium",
  });

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm text-brand-900">{customer.fullName ?? "—"}</h1>
          <p className="mt-1 text-sm text-brand-500">
            {customer.type === "registered" ? t("registered") : t("manual")} ·{" "}
            {t("joinedOn", { date: dateFormatter.format(new Date(customer.createdAt)) })}
          </p>
        </div>
        {customer.wholesaleStatus === "approved" && (
          <span className="rounded-(--radius-pill) bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
            {t("wholesale")}
          </span>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
          <h2 className="font-display text-lg text-brand-900">{t("contact")}</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-500">{t("phone")}</dt>
              <dd className="text-brand-900">{customer.phone ?? "—"}</dd>
            </div>
            {customer.email && (
              <div className="flex justify-between">
                <dt className="text-brand-500">{t("email")}</dt>
                <dd className="text-brand-900">{customer.email}</dd>
              </div>
            )}
            {customer.companyName && (
              <div className="flex justify-between">
                <dt className="text-brand-500">{t("companyName")}</dt>
                <dd className="text-brand-900">{customer.companyName}</dd>
              </div>
            )}
            {customer.address && (
              <div className="pt-1">
                <dt className="text-brand-500">{t("address")}</dt>
                <dd className="mt-0.5 text-brand-900">{customer.address}</dd>
              </div>
            )}
          </dl>
          {customer.type === "manual" && (
            <div className="mt-4">
              <ManualCustomerEditForm
                customerId={customer.id}
                fullName={customer.fullName}
                phone={customer.phone}
                email={customer.email}
                address={customer.address}
                notes={customer.notes}
              />
            </div>
          )}
        </section>

        <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
          <h2 className="font-display text-lg text-brand-900">{t("summary")}</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-500">{t("orderCount")}</dt>
              <dd className="text-brand-900">{customer.orderCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-500">{t("lifetimeValue")}</dt>
              <dd className="text-brand-900">
                {customer.lifetimeValue.toFixed(2)} {tOrders("currency")}
              </dd>
            </div>
          </dl>
          {customer.notes && customer.type === "manual" && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-brand-700">{t("notes")}</p>
              <p className="mt-1 text-sm text-brand-700">{customer.notes}</p>
            </div>
          )}
        </section>
      </div>

      <section>
        <h2 className="font-display text-lg text-brand-900">{t("orderHistory")}</h2>
        {customer.orders.length === 0 ? (
          <p className="mt-3 text-sm text-brand-500">{t("noOrders")}</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-(--radius-card) border border-brand-200 bg-paper">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-200 text-start text-xs uppercase tracking-wider text-brand-500">
                  <th className="px-5 py-3 text-start">{tOrders("orderNumber")}</th>
                  <th className="px-5 py-3 text-start">{tOrders("total")}</th>
                  <th className="px-5 py-3 text-start">{tOrders("status.label")}</th>
                  <th className="px-5 py-3 text-start">{tOrders("date")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-200">
                {customer.orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-900 hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-brand-700">
                      {order.total.toFixed(2)} {tOrders("currency")}
                    </td>
                    <td className="px-5 py-3">
                      <OrderStatusBadge
                        status={order.status as OrderStatus}
                        label={tOrders(`status.${order.status}`)}
                      />
                    </td>
                    <td className="px-5 py-3 text-brand-500">{dateFormatter.format(new Date(order.createdAt))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
