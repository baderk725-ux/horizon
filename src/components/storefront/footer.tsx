import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { getStoreSettings } from "@/lib/data/settings";
import { getSiteContentMap, pickContent } from "@/lib/data/cms";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const b = await getTranslations("brand");
  const [settings, contentMap] = await Promise.all([getStoreSettings(), getSiteContentMap()]);
  const rightsText = pickContent(
    contentMap,
    "footer_rights",
    locale,
    `© ${new Date().getFullYear()} ${b("name")} — ${t("rights")}.`,
  );
  const hasContact =
    settings &&
    (settings.support_email ||
      settings.support_phone ||
      settings.whatsapp_number ||
      settings.instagram_url ||
      settings.facebook_url ||
      settings.tiktok_url);

  const columns = [
    {
      title: nav("shop"),
      links: [{ href: "/shop", label: nav("shop") }],
    },
    {
      title: nav("help"),
      links: [
        { href: "/faq", label: nav("faq") },
        { href: "/policies", label: nav("policies") },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-brand-200 bg-brand-900 text-brand-100">
      <Container className="grid gap-10 py-16 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-paper">{b("name")}</p>
          <p className="mt-2 text-sm text-brand-300">{b("tagline")}</p>
          {hasContact && (
            <ul className="mt-4 space-y-1.5 text-sm text-brand-300">
              {settings?.support_phone && (
                <li>
                  <a href={`tel:${settings.support_phone}`} className="hover:text-accent-400">
                    {settings.support_phone}
                  </a>
                </li>
              )}
              {settings?.whatsapp_number && (
                <li>
                  <a
                    href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`}
                    className="hover:text-accent-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("whatsapp")}
                  </a>
                </li>
              )}
              {settings?.support_email && (
                <li>
                  <a href={`mailto:${settings.support_email}`} className="hover:text-accent-400">
                    {settings.support_email}
                  </a>
                </li>
              )}
              {(settings?.instagram_url || settings?.facebook_url || settings?.tiktok_url) && (
                <li className="flex gap-3 pt-1">
                  {settings.instagram_url && (
                    <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-400">
                      Instagram
                    </a>
                  )}
                  {settings.facebook_url && (
                    <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-400">
                      Facebook
                    </a>
                  )}
                  {settings.tiktok_url && (
                    <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-400">
                      TikTok
                    </a>
                  )}
                </li>
              )}
            </ul>
          )}
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-medium uppercase tracking-widest text-brand-300">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="border-t border-brand-800 py-6 text-xs text-brand-400">
        {rightsText}
      </Container>
    </footer>
  );
}
