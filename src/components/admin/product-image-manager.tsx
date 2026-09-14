"use client";

import { useActionState, useRef, useTransition } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  uploadProductImageAction,
  deleteProductImageAction,
  type ProductImageActionState,
} from "@/lib/actions/product-images";
import { Button } from "@/components/ui/button";

const initialState: ProductImageActionState = { error: null };

export function ProductImageManager({
  productId,
  images,
}: {
  productId: string;
  images: { id: string; url: string; sort_order: number }[];
}) {
  const t = useTranslations("adminProducts");
  const formRef = useRef<HTMLFormElement>(null);
  const uploadAction = uploadProductImageAction.bind(null, productId);
  const [state, formAction, pending] = useActionState(uploadAction, initialState);
  const [deletePending, startDelete] = useTransition();

  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <h2 className="font-display text-lg text-brand-900">{t("images")}</h2>

      {sorted.length === 0 ? (
        <p className="mt-3 text-sm text-brand-500">{t("noImages")}</p>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {sorted.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-(--radius-card) bg-brand-100">
              <Image src={image.url} alt="" fill sizes="200px" className="object-cover" />
              <button
                type="button"
                disabled={deletePending}
                onClick={() =>
                  startDelete(async () => {
                    await deleteProductImageAction(image.id, productId);
                  })
                }
                className="absolute inset-x-0 bottom-0 bg-brand-950/80 py-1.5 text-xs font-medium text-paper opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
              >
                {t("removeImage")}
              </button>
            </div>
          ))}
        </div>
      )}

      <form
        ref={formRef}
        action={async (formData) => {
          await formAction(formData);
          formRef.current?.reset();
        }}
        className="mt-4 flex items-center gap-3"
      >
        <input
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          required
          className="text-sm text-brand-700 file:me-3 file:rounded-(--radius-button) file:border-0 file:bg-brand-900 file:px-4 file:py-2 file:text-xs file:font-medium file:uppercase file:tracking-wider file:text-paper"
        />
        <Button type="submit" size="sm" variant="secondary" disabled={pending}>
          {pending ? t("uploading") : t("uploadImage")}
        </Button>
      </form>
      {state.error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {t(state.error)}
        </p>
      )}
    </div>
  );
}
