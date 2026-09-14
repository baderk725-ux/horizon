import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Cairo } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getThemeSettings } from "@/lib/data/theme";
import { buildBrandScale, buildAccentScale } from "@/lib/theme/palette";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "brand" });

  return {
    title: {
      default: t("name"),
      template: `%s | ${t("name")}`,
    },
    description: t("tagline"),
  };
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  const theme = await getThemeSettings();
  const brandScale = buildBrandScale(theme.primary_color);
  const accentScale = buildAccentScale(theme.accent_color);
  const themeVars = [
    ...Object.entries(brandScale).map(([step, hex]) => `--color-brand-${step}:${hex}`),
    ...Object.entries(accentScale).map(([step, hex]) => `--color-accent-${step}:${hex}`),
  ].join(";");

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cormorant.variable} ${jost.variable} ${cairo.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Runtime theme override — the admin-editable primary/accent colors
            from theme_settings, derived into the full token scale. Sits
            after globals.css's @theme block so it wins on specificity
            without needing !important. */}
        <style dangerouslySetInnerHTML={{ __html: `:root{${themeVars}}` }} />
      </head>
      <body>
        <NextIntlClientProvider>{props.children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
