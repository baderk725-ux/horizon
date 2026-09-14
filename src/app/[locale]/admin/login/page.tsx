import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Link } from "@/i18n/navigation";

export default async function AdminLoginPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const current = await getCurrentUser();
  const t = await getTranslations("admin");
  const bt = await getTranslations("brand");

  if (current && isAdmin(current.profile)) {
    redirect({ href: "/admin", locale });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-950 px-4 py-16">
      <div className="w-full max-w-sm rounded-(--radius-card) bg-paper p-8 shadow-(--shadow-card-hover)">
        <Link href="/" className="block text-center font-display text-2xl text-brand-900">
          {bt("name")}
        </Link>
        <h1 className="mt-2 text-center text-xs font-medium uppercase tracking-widest text-brand-500">
          {t("signIn")}
        </h1>
        <div className="mt-8">
          <SignInForm onSuccessRedirect={`/${locale}/admin`} />
        </div>
      </div>
    </div>
  );
}
