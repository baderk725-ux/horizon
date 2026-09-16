"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/types";
import { EditorialImage } from "@/components/EditorialImage";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[4/5] w-full overflow-hidden bg-cream">
        <EditorialImage
          icon={current.icon}
          tone={current.tone}
          url={current.url}
          alt={current.alt}
          className="h-full w-full"
          priority
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, i) => (
          <button
            key={image.alt}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            aria-current={i === active}
            className={`aspect-square overflow-hidden transition-opacity ${
              i === active ? "opacity-100 ring-1 ring-charcoal" : "opacity-70 hover:opacity-100"
            }`}
          >
            <EditorialImage
              icon={image.icon}
              tone={image.tone}
              url={image.url}
              alt={image.alt}
              className="h-full w-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
