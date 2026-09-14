import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/data/auth";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations("auth");
  const current = await getCurrentUser();

  return (
    <div>
      <h1 className="text-center font-display text-2xl text-brand-900">{t("resetPassword")}</h1>
      {current ? (
        <div className="mt-6">
          <ResetPasswordForm redirectTo={`/${locale}/account`} />
        </div>
      ) : (
        <>
          <p className="mt-4 text-center text-sm text-danger">{t("resetLinkInvalid")}</p>
          <p className="mt-6 text-center text-sm text-brand-600">
            <Link href="/forgot-password" className="font-medium text-brand-900 underline">
              {t("requestNewLink")}
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
