import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { Link } from "@/i18n/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getUnreadNotificationCount } from "@/lib/data/admin/notifications";

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

  const navLinks = [
    { href: "/admin", label: t("nav.dashboard") },
    { href: "/admin/orders", label: t("nav.orders") },
    { href: "/admin/payments", label: t("nav.payments") },
    { href: "/admin/discounts", label: t("nav.discounts") },
    { href: "/admin/bundles", label: t("nav.bundles") },
    { href: "/admin/customers", label: t("nav.customers") },
    { href: "/admin/wholesale", label: t("nav.wholesale") },
    { href: "/admin/inventory", label: t("nav.inventory") },
    { href: "/admin/suppliers", label: t("nav.suppliers") },
    { href: "/admin/purchase-orders", label: t("nav.purchaseOrders") },
    { href: "/admin/finance", label: t("nav.finance") },
    { href: "/admin/returns", label: t("nav.returns") },
    { href: "/admin/products", label: t("nav.products") },
    { href: "/admin/categories", label: t("nav.categories") },
    { href: "/admin/shipping", label: t("nav.shipping") },
    { href: "/admin/staff", label: t("nav.staff") },
    { href: "/admin/settings", label: t("nav.settings") },
  ];

  const unreadCount = await getUnreadNotificationCount();

  return (
    <div className="min-h-screen bg-paper-muted">
      <header className="flex h-16 items-center justify-between border-b border-brand-200 bg-brand-950 px-6 text-paper">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-display text-lg">
            NOVEL
          </Link>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-brand-200 hover:text-paper">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/admin/notifications" className="relative text-brand-200 hover:text-paper" aria-label={t("nav.notifications")}>
            {t("nav.notifications")}
            {unreadCount > 0 && (
              <span className="ms-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-(--radius-pill) bg-accent-500 px-1.5 text-xs font-medium text-brand-950">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          <span className="hidden text-brand-300 sm:inline">
            {t("signedInAs")} {current.profile?.full_name ?? current.email}
          </span>
          <SignOutButton className="hover:text-accent-400" />
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10">{props.children}</div>
    </div>
  );
}
