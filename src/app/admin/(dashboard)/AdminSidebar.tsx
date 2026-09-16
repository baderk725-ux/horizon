"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "../login/actions";

const NAV_SECTIONS = [
  {
    label: "Overview",
    links: [{ label: "Dashboard", href: "/admin" }],
  },
  {
    label: "Catalog",
    links: [
      { label: "Products", href: "/admin/products" },
      { label: "Categories", href: "/admin/categories" },
    ],
  },
  {
    label: "Content",
    links: [
      { label: "Homepage", href: "/admin/homepage" },
      { label: "Journal", href: "/admin/journal" },
    ],
  },
  {
    label: "Customers",
    links: [
      { label: "Contact Submissions", href: "/admin/contact-submissions" },
      { label: "Newsletter", href: "/admin/newsletter" },
    ],
  },
  {
    label: "Configuration",
    links: [{ label: "Settings", href: "/admin/settings" }],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-[#0f0d0b] text-ivory">
      <div className="border-b border-white/10 px-6 py-6">
        <span className="font-serif text-xl tracking-[0.14em]">NOVEL</span>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40">Admin Console</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-6">
            <h3 className="mb-2 px-2 text-[10px] uppercase tracking-[0.18em] text-white/30">
              {section.label}
            </h3>
            <ul className="flex flex-col gap-1">
              {section.links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded-sm px-3 py-2 text-sm transition-colors ${
                        active ? "bg-white/10 text-ivory" : "text-white/60 hover:bg-white/5 hover:text-ivory"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <Link
          href="/"
          target="_blank"
          className="block px-2 py-2 text-xs uppercase tracking-[0.14em] text-white/50 hover:text-ivory"
        >
          View Storefront ↗
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="mt-1 w-full px-2 py-2 text-left text-xs uppercase tracking-[0.14em] text-white/50 hover:text-ivory"
          >
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
