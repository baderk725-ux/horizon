import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { getFaqs } from "@/lib/data/cms";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/faq` },
  };
}

export default async function FaqPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations("faq");
  const faqs = await getFaqs({ activeOnly: true });

  return (
    <Container className="py-16">
      <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
      {faqs.length === 0 ? (
        <p className="mt-8 text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <dl className="mt-10 max-w-2xl space-y-8">
          {faqs.map((faq) => (
            <div key={faq.id}>
              <dt className="font-display text-lg text-brand-900">
                {locale === "ar" ? faq.question_ar : faq.question_en}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-brand-600">
                {locale === "ar" ? faq.answer_ar : faq.answer_en}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Container>
  );
}
