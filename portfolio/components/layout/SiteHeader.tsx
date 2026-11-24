"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Monogram } from "@/components/brand/Monogram";
import { buttonClass } from "@/components/ui/Button";
import { site } from "@/lib/site";

const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#capabilities", label: "Services" },
  { href: "/#about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Close on route change
  useEffect(() => setOpen(false), [pathname]);

  // Focus trap + Esc + scroll lock while the menu is open
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("k:scroll-lock", { detail: true }));
    const dialog = dialogRef.current;
    const focusables = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab") return;
      const els = focusables();
      const first = els[0];
      const last = els[els.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.dispatchEvent(new CustomEvent("k:scroll-lock", { detail: false }));
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-site flex h-[4.5rem] items-center justify-between">
        <Link href="/" className="flex min-h-11 items-center gap-3" aria-label={`${site.name} — home`}>
          <Monogram />
          <span className="label text-silver">{site.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="label py-3 text-silver transition-colors hover:text-lime">
              {item.label}
            </Link>
          ))}
          <Link href="/start" className={buttonClass("secondary", "min-h-10 px-5 py-2.5 text-sm")}>
            Start a project
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="label flex min-h-11 items-center gap-2 px-1 text-silver md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="relative block h-2.5 w-5">
            <span className={`absolute left-0 h-px w-5 bg-silver transition-transform duration-300 ease-flow ${open ? "top-1 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-px w-5 bg-silver transition-transform duration-300 ease-flow ${open ? "top-1 -rotate-45" : "top-2"}`} />
          </span>
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile fullscreen menu */}
      <div
        id={menuId}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 top-[4.5rem] z-40 bg-obsidian md:hidden"
      >
        <nav aria-label="Mobile" className="container-site flex h-full flex-col justify-between pb-10 pt-8">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <Link href={item.href} onClick={close} className="flex items-baseline gap-4 py-5">
                  <span className="label text-muted">0{i + 1}</span>
                  <span className="display wdth-118 text-display-m">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4">
            <Link href="/start" onClick={close} className={buttonClass("primary", "justify-center")}>
              Start a project
            </Link>
            {site.email && (
              <a href={`mailto:${site.email}`} className="label text-center text-muted">
                {site.email}
              </a>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
