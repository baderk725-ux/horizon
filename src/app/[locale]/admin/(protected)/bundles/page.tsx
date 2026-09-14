import { getTranslations } from "next-intl/server";
import { getAdminBundles } from "@/lib/data/admin/bundles";
import { getBundleDetailAction } from "@/lib/actions/bundle-detail";
import { BundlesManager } from "@/components/admin/bundles-manager";

export default async function AdminBundlesPage() {
  const t = await getTranslations("adminBundles");
  const bundles = await getAdminBundles();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("pageTitle")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <BundlesManager bundles={bundles} loadDetail={getBundleDetailAction} />
    </div>
  );
}
