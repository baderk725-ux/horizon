"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/lib/products";
import type { CartLine } from "@/lib/types";

interface CartContextValue {
  lines: CartLine[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (productId: string, variantId: string | undefined, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "novel-cart";

function lineKey(productId: string, variantId?: string) {
  return `${productId}::${variantId ?? "default"}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage: must run after mount so server
    // and first client render match, avoiding a hydration mismatch.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore write failures (private browsing, quota)
    }
  }, [lines, hydrated]);

  const addItem = useCallback(
    (productId: string, variantId: string | undefined, quantity = 1) => {
      setLines((prev) => {
        const key = lineKey(productId, variantId);
        const existing = prev.find((l) => lineKey(l.productId, l.variantId) === key);
        if (existing) {
          return prev.map((l) =>
            lineKey(l.productId, l.variantId) === key
              ? { ...l, quantity: l.quantity + quantity }
              : l
          );
        }
        return [...prev, { productId, variantId, quantity }];
      });
      setDrawerOpen(true);
    },
    []
  );

  const removeItem = useCallback((productId: string, variantId?: string) => {
    const key = lineKey(productId, variantId);
    setLines((prev) => prev.filter((l) => lineKey(l.productId, l.variantId) !== key));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, variantId: string | undefined, quantity: number) => {
      const key = lineKey(productId, variantId);
      setLines((prev) =>
        quantity <= 0
          ? prev.filter((l) => lineKey(l.productId, l.variantId) !== key)
          : prev.map((l) =>
              lineKey(l.productId, l.variantId) === key ? { ...l, quantity } : l
            )
      );
    },
    []
  );

  const clearCart = useCallback(() => setLines([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const { itemCount, subtotal } = useMemo(() => {
    let count = 0;
    let total = 0;
    for (const line of lines) {
      const product = products.find((p) => p.id === line.productId);
      if (!product) continue;
      const variant = product.variants?.find((v) => v.id === line.variantId);
      const price = product.price + (variant?.priceModifier ?? 0);
      count += line.quantity;
      total += price * line.quantity;
    }
    return { itemCount: count, subtotal: total };
  }, [lines]);

  const value: CartContextValue = {
    lines,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
