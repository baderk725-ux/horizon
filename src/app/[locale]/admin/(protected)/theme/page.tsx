import { getTranslations } from "next-intl/server";
import { getThemeSettings } from "@/lib/data/theme";
import { ThemeSettingsForm } from "@/components/admin/theme-settings-form";

export default async function AdminThemePage() {
  const t = await getTranslations("adminTheme");
  const theme = await getThemeSettings();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <section className="rounded-(--radius-card) border border-brand-200 bg-paper p-6">
        <ThemeSettingsForm theme={theme} />
      </section>
    </div>
  );
}
