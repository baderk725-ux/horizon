import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { LocaleSwitcher } from "@/components/storefront/locale-switcher";
import { SignOutButton } from "@/components/auth/sign-out-button";
import type { getCurrentUser } from "@/lib/data/auth";
import { getCart } from "@/lib/data/cart";

export async function Header({
  current,
}: {
  current: Awaited<ReturnType<typeof getCurrentUser>>;
}) {
  const t = await getTranslations("nav");
  const b = await getTranslations("brand");
  const locale = await getLocale();
  const cart = await getCart();

  const links = [
    { href: "/shop", label: t("shop") },
    { href: "/categories", label: t("categories") },
    { href: "/collections", label: t("collections") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-brand-200 bg-paper/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-2xl tracking-wide text-brand-900"
        >
          {b("name")}
        </Link>

        <nav
          className="hidden items-center gap-8 font-sans text-sm uppercase tracking-wider text-brand-800 lg:flex"
          aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-accent-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-sm text-brand-800">
          <LocaleSwitcher />
          {current ? (
            <>
              <Link href="/account" className="hover:text-accent-600">
                {current.profile?.full_name?.split(" ")[0] ?? t("account")}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link href="/sign-in" className="hover:text-accent-600">
              {t("account")}
            </Link>
          )}
          <Link href="/cart" aria-label={t("cart")} className="relative hover:text-accent-600">
            {t("cart")}
            {cart.itemCount > 0 && (
              <span className="absolute -end-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-(--radius-pill) bg-accent-500 px-1 text-[10px] font-medium text-paper">
                {cart.itemCount}
              </span>
            )}
          </Link>
        </div>
      </Container>
    </header>
  );
}
