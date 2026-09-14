import { getTranslations } from "next-intl/server";
import { getSiteContentMap, getFaqs } from "@/lib/data/cms";
import { SiteContentForm } from "@/components/admin/site-content-form";
import { FaqAdminItem } from "@/components/admin/faq-admin-item";
import { FaqCreateForm } from "@/components/admin/faq-create-form";

export default async function AdminContentPage() {
  const t = await getTranslations("adminContent");
  const [contentMap, faqs] = await Promise.all([
    getSiteContentMap(),
    getFaqs({ activeOnly: false }),
  ]);
  const contentRows = Object.values(contentMap).sort((a, b) => a.key.localeCompare(b.key));
  const nextSortOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.sort_order)) + 1 : 0;

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-lg text-brand-900">{t("siteContent")}</h2>
        {contentRows.length === 0 ? (
          <p className="text-sm text-brand-500">{t("emptyContent")}</p>
        ) : (
          <SiteContentForm rows={contentRows} />
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg text-brand-900">{t("faqs")}</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <FaqAdminItem key={faq.id} faq={faq} />
          ))}
        </div>
        <FaqCreateForm nextSortOrder={nextSortOrder} />
      </section>
    </div>
  );
}
