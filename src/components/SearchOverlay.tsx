"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const RECENT_SEARCHES = ["Linen throw", "Macramé wall hanging", "Stoneware jug"];

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
}

export function SearchOverlay({ open, onClose, products, categories }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setQuery("");
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.category.includes(q)).slice(0, 6);
  }, [query, products]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in bg-ivory" role="dialog" aria-modal="true" aria-label="Search">
      <div className="container-editorial flex h-full flex-col py-6">
        <div className="flex items-center gap-4 border-b border-line pb-6">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-stone" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories…"
            className="w-full bg-transparent font-serif text-2xl text-charcoal placeholder:text-stone focus:outline-none md:text-3xl"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-10 w-10 shrink-0 items-center justify-center text-charcoal hover:text-stone"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-8 flex-1 overflow-y-auto">
          {query.trim().length < 2 ? (
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <h3 className="text-xs uppercase tracking-[0.14em] text-stone">Recent Searches</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {RECENT_SEARCHES.map((term) => (
                    <li key={term}>
                      <button
                        type="button"
                        onClick={() => setQuery(term)}
                        className="font-serif text-lg text-charcoal hover:text-espresso"
                      >
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.14em] text-stone">Popular Categories</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {categories.slice(0, 5).map((c) => (
                    <li key={c.slug}>
                      <Link href={`/shop/${c.slug}`} onClick={onClose} className="font-serif text-lg text-charcoal hover:text-espresso">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xs uppercase tracking-[0.14em] text-stone">
                {results.length ? `${results.length} Results` : "No results"}
              </h3>
              <ul className="mt-4 divide-y divide-line">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between py-4 hover:text-espresso"
                    >
                      <span className="font-serif text-lg">{p.name}</span>
                      <span className="text-sm text-stone">{formatPrice(p.price, p.currency)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
