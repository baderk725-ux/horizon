import { getTranslations } from "next-intl/server";
import { getStoreSettings } from "@/lib/data/settings";
import { StoreSettingsForm } from "@/components/admin/store-settings-form";

export default async function AdminSettingsPage() {
  const t = await getTranslations("adminSettings");
  const settings = await getStoreSettings();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      {settings && (
        <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
          <StoreSettingsForm settings={settings} />
        </section>
      )}
    </div>
  );
}
