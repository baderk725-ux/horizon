import { getTranslations } from "next-intl/server";
import { getAdminSuppliers } from "@/lib/data/admin/suppliers";
import { PurchaseOrderForm } from "@/components/admin/purchase-order-form";

export default async function NewPurchaseOrderPage() {
  const t = await getTranslations("adminPurchaseOrders");
  const suppliers = await getAdminSuppliers();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("newPurchaseOrder")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("newPurchaseOrderHint")}</p>
      </div>

      <PurchaseOrderForm suppliers={suppliers} />
    </div>
  );
}
