"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Button, ButtonLink } from "@/components/ui/button";

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
      <p className="mt-3 max-w-md text-sm text-brand-600">{t("body")}</p>
      <div className="mt-8 flex items-center gap-4">
        <Button type="button" onClick={() => reset()} size="md">
          {t("retry")}
        </Button>
        <ButtonLink href="/" variant="secondary" size="md">
          {t("backHome")}
        </ButtonLink>
      </div>
    </Container>
  );
}
