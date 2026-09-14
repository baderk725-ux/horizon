import { getTranslations } from "next-intl/server";
import { getGovernoratesWithAreas } from "@/lib/data/checkout";
import { getManualCustomers } from "@/lib/data/admin/manual-customers";
import { ManualOrderForm } from "@/components/admin/manual-order-form";

export default async function NewManualOrderPage() {
  const t = await getTranslations("adminOrders");
  const [governorates, manualCustomers] = await Promise.all([
    getGovernoratesWithAreas(),
    getManualCustomers(),
  ]);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-display-sm text-brand-900">{t("newManualOrder")}</h1>
      <p className="mt-2 text-sm text-brand-500">{t("newManualOrderHint")}</p>
      <div className="mt-6 rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <ManualOrderForm governorates={governorates} manualCustomers={manualCustomers} />
      </div>
    </div>
  );
}
