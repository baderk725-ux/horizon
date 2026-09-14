import { getTranslations } from "next-intl/server";
import { getAdminSuppliers } from "@/lib/data/admin/suppliers";
import { SuppliersManager } from "@/components/admin/suppliers-manager";

export default async function AdminSuppliersPage() {
  const t = await getTranslations("adminSuppliers");
  const suppliers = await getAdminSuppliers();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("pageTitle")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <SuppliersManager suppliers={suppliers} />
    </div>
  );
}
