import { getTranslations } from "next-intl/server";
import { getAdminCollections } from "@/lib/data/admin/collections";
import { getCollectionDetailAction } from "@/lib/actions/collection-detail";
import { CollectionsManager } from "@/components/admin/collections-manager";

export default async function AdminCollectionsPage() {
  const t = await getTranslations("adminCollections");
  const collections = await getAdminCollections();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("pageTitle")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <CollectionsManager collections={collections} loadDetail={getCollectionDetailAction} />
    </div>
  );
}
