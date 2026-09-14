import { getTranslations } from "next-intl/server";
import { getAdminCoupons } from "@/lib/data/admin/discounts";
import { CouponsManager } from "@/components/admin/coupons-manager";

export default async function AdminDiscountsPage() {
  const t = await getTranslations("adminDiscounts");
  const coupons = await getAdminCoupons();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("pageTitle")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <CouponsManager coupons={coupons} />
    </div>
  );
}
