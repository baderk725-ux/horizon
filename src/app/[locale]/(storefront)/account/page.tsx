import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/data/auth";

export default async function AccountPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const session = await getCurrentUser();

  if (!session) {
    redirect({ href: "/sign-in", locale });
  }
  const current = session!;

  const t = await getTranslations("account");
  const role = current.profile?.role ?? "customer";
  const memberSince = current.profile?.created_at
    ? new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-JO", {
        year: "numeric",
        month: "long",
      }).format(new Date(current.profile.created_at))
    : null;

  return (
    <Container className="max-w-2xl py-(--spacing-section)">
      <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>

      <dl className="mt-8 divide-y divide-brand-200 rounded-(--radius-card) border border-brand-200 bg-paper">
        <div className="flex items-center justify-between px-5 py-4">
          <dt className="text-sm text-brand-600">{t("signedInAs")}</dt>
          <dd className="text-sm font-medium text-brand-900">
            {current.profile?.full_name ?? current.email}
          </dd>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <dt className="text-sm text-brand-600">{t("role")}</dt>
          <dd className="text-sm font-medium text-brand-900">
            {t(`roles.${role}` as "roles.customer" | "roles.wholesale_customer" | "roles.admin")}
          </dd>
        </div>
        {memberSince && (
          <div className="flex items-center justify-between px-5 py-4">
            <dt className="text-sm text-brand-600">{t("memberSince")}</dt>
            <dd className="text-sm font-medium text-brand-900">{memberSince}</dd>
          </div>
        )}
      </dl>

      <Link
        href="/account/orders"
        className="mt-8 inline-block text-sm font-medium uppercase tracking-wider text-brand-700 underline hover:text-brand-900"
      >
        {t("myOrders")}
      </Link>

      <SignOutButton className="mt-4 block text-sm font-medium uppercase tracking-wider text-brand-700 underline hover:text-brand-900" />
    </Container>
  );
}
