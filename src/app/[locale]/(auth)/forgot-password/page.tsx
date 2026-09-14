import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");

  return (
    <div>
      <h1 className="text-center font-display text-2xl text-brand-900">{t("forgotPassword")}</h1>
      <p className="mt-2 text-center text-sm text-brand-600">{t("forgotPasswordHint")}</p>
      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
      <p className="mt-6 text-center text-sm text-brand-600">
        <Link href="/sign-in" className="font-medium text-brand-900 underline">
          {t("backToSignIn")}
        </Link>
      </p>
    </div>
  );
}
