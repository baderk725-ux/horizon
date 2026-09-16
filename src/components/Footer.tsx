import Link from "next/link";
import { Logo } from "./Logo";
import { Newsletter } from "./Newsletter";

const SHOP_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "New Arrivals", href: "/shop/new-arrivals" },
  { label: "Best Sellers", href: "/shop/best-sellers" },
  { label: "Gifts", href: "/shop/gifts" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

const HELP_LINKS = [
  { label: "FAQ", href: "/contact#faq" },
  { label: "Shipping", href: "/contact#shipping-time" },
  { label: "Returns", href: "/contact#returns" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream">
      <div className="container-editorial py-16 md:py-20">
        <Newsletter tone="dark" />

        <div className="mt-16 grid grid-cols-2 gap-10 border-t border-line pt-12 md:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Logo />
            <p className="text-sm leading-relaxed text-stone">
              Beautiful things for a considered home.
            </p>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Help" links={HELP_LINKS} />

          <div className="flex flex-col gap-3">
            <h3 className="text-xs uppercase tracking-[0.14em] text-stone">Follow</h3>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-charcoal hover:text-espresso"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-xs text-stone md:flex-row">
          <p>&copy; {new Date().getFullYear()} NOVEL. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-charcoal">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-charcoal">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs uppercase tracking-[0.14em] text-stone">{title}</h3>
      {links.map((link) => (
        <Link key={link.label} href={link.href} className="text-sm text-charcoal hover:text-espresso">
          {link.label}
        </Link>
      ))}
    </div>
  );
}
