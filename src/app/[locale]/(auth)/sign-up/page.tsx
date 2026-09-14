import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/data/auth";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Link } from "@/i18n/navigation";

export default async function SignUpPage(props: {
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
        {t("signUp")}
      </h1>
      <div className="mt-6">
        <SignUpForm />
      </div>
      <p className="mt-6 text-center text-sm text-brand-600">
        {t("alreadyHaveAccount")}{" "}
        <Link href="/sign-in" className="font-medium text-brand-900 underline">
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}
