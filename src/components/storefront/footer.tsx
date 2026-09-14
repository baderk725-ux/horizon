import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const b = useTranslations("brand");

  const columns = [
    {
      title: nav("shop"),
      links: [
        { href: "/shop", label: nav("shop") },
        { href: "/categories", label: nav("categories") },
        { href: "/collections", label: nav("collections") },
      ],
    },
    {
      title: nav("about"),
      links: [
        { href: "/about", label: nav("about") },
        { href: "/contact", label: nav("contact") },
        { href: "/faq", label: "FAQ" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/shipping-policy", label: "Shipping" },
        { href: "/returns-policy", label: "Returns" },
        { href: "/privacy-policy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-brand-200 bg-brand-900 text-brand-100">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl text-paper">{b("name")}</p>
          <p className="mt-2 text-sm text-brand-300">{b("tagline")}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-medium uppercase tracking-widest text-brand-300">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="border-t border-brand-800 py-6 text-xs text-brand-400">
        © {new Date().getFullYear()} {b("name")} — {t("rights")}.
      </Container>
    </footer>
  );
}
