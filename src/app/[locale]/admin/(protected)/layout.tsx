import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { Link } from "@/i18n/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function AdminProtectedLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const session = await getCurrentUser();

  if (!session) {
    redirect({ href: "/admin/login", locale });
  }
  const current = session!;

  const t = await getTranslations("admin");

  if (!isAdmin(current.profile)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-muted px-4 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-2xl text-brand-900">
            {t("forbiddenTitle")}
          </h1>
          <p className="mt-3 text-sm text-brand-600">{t("forbiddenBody")}</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link href="/" className="text-sm font-medium text-brand-900 underline">
              {t("backToStore")}
            </Link>
            <SignOutButton className="text-sm font-medium text-brand-700 underline" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-muted">
      <header className="flex h-16 items-center justify-between border-b border-brand-200 bg-brand-950 px-6 text-paper">
        <Link href="/admin" className="font-display text-lg">
          NOVEL — {t("dashboard")}
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-brand-300">
            {t("signedInAs")} {current.profile?.full_name ?? current.email}
          </span>
          <SignOutButton className="hover:text-accent-400" />
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10">{props.children}</div>
    </div>
  );
}
