"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ProductImage } from "@/lib/types";
import { addProductImageRecord, deleteProductImageAction } from "./images-actions";
import { AdminButton } from "../_components/ui";

export function ImageManager({ productId, images }: { productId: string; images: ProductImage[] }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${productId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(path);

      await addProductImageRecord(productId, publicUrl, file.name);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleDelete(imageId: string, url?: string | null) {
    const storagePath = url ? extractStoragePath(url) : undefined;
    startTransition(async () => {
      await deleteProductImageAction(productId, imageId, storagePath);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images
          .filter((img) => img.id)
          .map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden border border-[#e2d8c8]">
              {img.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#f3ecdf] text-xs text-[#9a8b73]">
                  Placeholder
                </div>
              )}
              <button
                type="button"
                onClick={() => handleDelete(img.id!, img.url)}
                disabled={isPending}
                className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center bg-black/70 text-xs text-white group-hover:flex"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
          className="hidden"
          id="product-image-upload"
        />
        <AdminButton
          type="button"
          variant="secondary"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Upload Image"}
        </AdminButton>
        {error ? <span className="text-xs text-red-700">{error}</span> : null}
      </div>
      <p className="mt-2 text-xs text-[#9a8b73]">
        Until you upload real photography, this product falls back to the placeholder art shown
        on the storefront.
      </p>
    </div>
  );
}

function extractStoragePath(publicUrl: string): string | undefined {
  const marker = "/object/public/product-images/";
  const index = publicUrl.indexOf(marker);
  if (index === -1) return undefined;
  return publicUrl.slice(index + marker.length);
}
