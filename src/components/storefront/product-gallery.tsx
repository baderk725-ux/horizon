"use client";

import { useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";

export function ProductGallery({
  images,
  alt,
}: {
  images: { url: string; sort_order: number }[];
  alt: string;
}) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(0);

  if (sorted.length === 0) {
    return (
      <div className="aspect-square rounded-(--radius-card) bg-brand-100" />
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-(--radius-card) bg-brand-100">
        <Image
          src={sorted[active].url}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {sorted.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {sorted.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(i)}
              className={clsx(
                "relative aspect-square overflow-hidden rounded-(--radius-card) bg-brand-100 ring-2 transition-colors",
                i === active ? "ring-brand-900" : "ring-transparent hover:ring-brand-300",
              )}
              aria-label={`${alt} ${i + 1}`}
              aria-current={i === active}
            >
              <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
