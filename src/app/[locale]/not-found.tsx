import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
      <p className="mt-3 max-w-md text-sm text-brand-600">{t("body")}</p>
      <div className="mt-8">
        <ButtonLink href="/" size="md">
          {t("backHome")}
        </ButtonLink>
      </div>
    </Container>
  );
}
