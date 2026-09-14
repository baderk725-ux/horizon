"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { addToCartAction } from "@/lib/actions/cart";
import { Button } from "@/components/ui/button";

export function AddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  const t = useTranslations("product");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={disabled || pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await addToCartAction(productId, 1);
            if (result.error) setError(result.error);
            else router.refresh();
          });
        }}
      >
        {disabled ? t("outOfStock") : pending ? t("adding") : t("addToCart")}
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {t(error)}
        </p>
      )}
    </div>
  );
}
