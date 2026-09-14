import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/auth";
import { getMyWholesaleApplication } from "@/lib/data/wholesale";
import { WholesaleApplicationForm } from "@/components/storefront/wholesale-application-form";

export default async function WholesaleApplicationPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const session = await getCurrentUser();
  if (!session) {
    redirect({ href: "/sign-in", locale });
  }
  const current = session!;

  const t = await getTranslations("account");

  if (current.profile?.role === "wholesale_customer" && current.profile.wholesale_status === "approved") {
    return (
      <Container className="max-w-xl py-(--spacing-section)">
        <h1 className="font-display text-display-sm text-brand-900">{t("wholesaleTitle")}</h1>
        <p className="mt-4 text-sm text-brand-600">{t("wholesaleApproved")}</p>
      </Container>
    );
  }

  const application = await getMyWholesaleApplication(current.userId);

  if (application && application.status !== "rejected") {
    return (
      <Container className="max-w-xl py-(--spacing-section)">
        <h1 className="font-display text-display-sm text-brand-900">{t("wholesaleTitle")}</h1>
        <p className="mt-4 text-sm text-brand-600">
          {application.status === "pending" ? t("wholesalePending") : t("wholesaleApproved")}
        </p>
      </Container>
    );
  }

  const supabase = await createClient();
  const { data: governorates } = await supabase
    .from("governorates")
    .select("id, name_en, name_ar")
    .order("name_en", { ascending: true });

  return (
    <Container className="max-w-xl py-(--spacing-section)">
      <h1 className="font-display text-display-sm text-brand-900">{t("wholesaleTitle")}</h1>
      <p className="mt-2 text-sm text-brand-500">{t("wholesaleHint")}</p>
      {application?.status === "rejected" && (
        <p className="mt-3 text-sm text-danger">{t("wholesaleRejectedNotice")}</p>
      )}
      <div className="mt-8">
        <WholesaleApplicationForm
          governorates={governorates ?? []}
          defaultFullName={current.profile?.full_name ?? undefined}
          defaultPhone={current.profile?.phone ?? undefined}
          defaultEmail={current.email ?? undefined}
        />
      </div>
    </Container>
  );
}
