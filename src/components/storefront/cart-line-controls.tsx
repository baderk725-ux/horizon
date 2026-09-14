"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  updateCartItemQuantityAction,
  removeCartItemAction,
} from "@/lib/actions/cart";

export function CartLineControls({
  cartItemId,
  quantity,
  maxQuantity,
}: {
  cartItemId: string;
  quantity: number;
  maxQuantity: number;
}) {
  const t = useTranslations("cart");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function update(nextQty: number) {
    setError(null);
    startTransition(async () => {
      const result = await updateCartItemQuantityAction(cartItemId, nextQty);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-4">
      <div className="inline-flex items-center rounded-(--radius-button) border border-brand-300">
        <button
          type="button"
          disabled={pending || quantity <= 1}
          onClick={() => update(quantity - 1)}
          className="px-3 py-1.5 text-brand-700 disabled:opacity-40"
          aria-label={t("decrease")}
        >
          −
        </button>
        <span className="min-w-8 text-center text-sm text-brand-900">{quantity}</span>
        <button
          type="button"
          disabled={pending || quantity >= maxQuantity}
          onClick={() => update(quantity + 1)}
          className="px-3 py-1.5 text-brand-700 disabled:opacity-40"
          aria-label={t("increase")}
        >
          +
        </button>
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await removeCartItemAction(cartItemId);
            if (result.error) setError(result.error);
            else router.refresh();
          })
        }
        className="text-sm font-medium text-brand-500 underline hover:text-danger disabled:opacity-50"
      >
        {t("remove")}
      </button>
      {error && <span className="text-xs text-danger">{t(error)}</span>}
    </div>
  );
}
