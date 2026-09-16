"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { SearchOverlay } from "./SearchOverlay";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/shop#collections" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const { itemCount, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  const transparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-500 ${
          transparent ? "bg-transparent" : "border-b border-line bg-ivory/95 backdrop-blur-sm"
        }`}
      >
        <div className="container-editorial flex h-20 items-center justify-between md:h-24">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className={`flex h-10 w-10 items-center justify-center md:hidden ${transparent ? "text-ivory" : "text-charcoal"}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-[0.14em] transition-colors hover:opacity-70 ${
                  transparent ? "text-ivory" : "text-charcoal"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Logo tone={transparent ? "light" : "dark"} className="absolute left-1/2 -translate-x-1/2" />

          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.14em] transition-colors hover:opacity-70 ${
                    transparent ? "text-ivory" : "text-charcoal"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className={`flex h-9 w-9 items-center justify-center ${transparent ? "text-ivory" : "text-charcoal"}`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
              </svg>
            </button>

            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} items`}
              className={`relative hidden h-9 w-9 items-center justify-center md:flex ${transparent ? "text-ivory" : "text-charcoal"}`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20s-7.5-4.8-10-9.5C.5 6.5 2.5 3 6 3c2 0 3.5 1 4 2.5C10.5 4 12 3 14 3c3.5 0 5.5 3.5 4 7.5C15.5 15.2 12 20 12 20z"
                />
              </svg>
              {wishlistCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-charcoal text-[9px] text-ivory">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Cart, ${itemCount} items`}
              className={`relative flex h-9 w-9 items-center justify-center ${transparent ? "text-ivory" : "text-charcoal"}`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 8h12l-1 12H7L6 8z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
              </svg>
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-charcoal text-[9px] text-ivory">
                  {itemCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div
        className={`fixed inset-0 z-50 bg-charcoal/40 transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-full max-w-xs flex-col bg-ivory transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <Logo />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center text-charcoal"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-6 py-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-line py-4 font-serif text-xl text-charcoal"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/wishlist" className="border-b border-line py-4 font-serif text-xl text-charcoal">
            Wishlist
          </Link>
        </nav>
      </div>
    </>
  );
}
