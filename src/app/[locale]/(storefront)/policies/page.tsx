import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { getSiteContentMap, pickContent } from "@/lib/data/cms";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "policies" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/policies` },
  };
}

export default async function PoliciesPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations("policies");
  const contentMap = await getSiteContentMap();
  const text = pickContent(contentMap, "policies_text", locale, t("fallback"));

  return (
    <Container className="py-16">
      <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-brand-700">{text}</p>
    </Container>
  );
}
