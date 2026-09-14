import { getTranslations } from "next-intl/server";
import { getShippingZones } from "@/lib/data/admin/shipping";
import { ShippingZonesManager } from "@/components/admin/shipping-zones-manager";
import { NewGovernorateForm } from "@/components/admin/new-governorate-form";

export default async function AdminShippingPage() {
  const t = await getTranslations("adminShipping");
  const zones = await getShippingZones();

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <ShippingZonesManager zones={zones} />

      <div className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <h2 className="font-display text-lg text-brand-900">{t("addGovernorate")}</h2>
        <p className="mt-1 text-xs text-brand-500">{t("addGovernorateHint")}</p>
        <div className="mt-4">
          <NewGovernorateForm />
        </div>
      </div>
    </div>
  );
}
