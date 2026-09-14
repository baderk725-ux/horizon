import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { getStoreSettings } from "@/lib/data/settings";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const settings = await getStoreSettings();
  const hasContact =
    settings &&
    (settings.support_email || settings.support_phone || settings.whatsapp_number);

  return (
    <Container className="py-(--spacing-section)">
      <h1 className="text-center font-display text-display-sm text-brand-900">{t("title")}</h1>

      {!hasContact ? (
        <p className="mt-8 max-w-md mx-auto text-center text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <ul className="mt-10 mx-auto max-w-sm space-y-4 text-center text-sm">
          {settings?.support_phone && (
            <li>
              <span className="block text-xs uppercase tracking-wider text-brand-500">{t("phone")}</span>
              <a href={`tel:${settings.support_phone}`} className="mt-1 block text-brand-900 hover:text-accent-600">
                {settings.support_phone}
              </a>
            </li>
          )}
          {settings?.whatsapp_number && (
            <li>
              <span className="block text-xs uppercase tracking-wider text-brand-500">{t("whatsapp")}</span>
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-brand-900 hover:text-accent-600"
              >
                {settings.whatsapp_number}
              </a>
            </li>
          )}
          {settings?.support_email && (
            <li>
              <span className="block text-xs uppercase tracking-wider text-brand-500">{t("email")}</span>
              <a href={`mailto:${settings.support_email}`} className="mt-1 block text-brand-900 hover:text-accent-600">
                {settings.support_email}
              </a>
            </li>
          )}
        </ul>
      )}
    </Container>
  );
}
