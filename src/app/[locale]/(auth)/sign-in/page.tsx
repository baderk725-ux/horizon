import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/data/auth";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Link } from "@/i18n/navigation";

export default async function SignInPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations("auth");
  const current = await getCurrentUser();

  if (current) {
    redirect({ href: "/account", locale });
  }

  return (
    <div>
      <h1 className="text-center font-display text-2xl text-brand-900">
        {t("signIn")}
      </h1>
      <div className="mt-6">
        <SignInForm onSuccessRedirect={`/${locale}/account`} />
      </div>
      <p className="mt-6 text-center text-sm text-brand-600">
        {t("noAccount")}{" "}
        <Link href="/sign-up" className="font-medium text-brand-900 underline">
          {t("createAccount")}
        </Link>
      </p>
    </div>
  );
}
