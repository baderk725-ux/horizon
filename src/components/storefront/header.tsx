import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { LocaleSwitcher } from "@/components/storefront/locale-switcher";

export function Header() {
  const t = useTranslations("nav");
  const b = useTranslations("brand");
  const locale = useLocale();

  const links = [
    { href: "/shop", label: t("shop") },
    { href: "/categories", label: t("categories") },
    { href: "/collections", label: t("collections") },
    { href: "/about", label: t("about") },
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
          <Link href="/account" aria-label={t("account")} className="hover:text-accent-600">
            {t("account")}
          </Link>
          <Link href="/wishlist" aria-label={t("wishlist")} className="hover:text-accent-600">
            {t("wishlist")}
          </Link>
          <Link href="/cart" aria-label={t("cart")} className="hover:text-accent-600">
            {t("cart")}
          </Link>
        </div>
      </Container>
    </header>
  );
}
