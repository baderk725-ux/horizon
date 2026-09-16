"use client";

import { useWishlist } from "@/context/WishlistContext";

export function WishlistButton({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(productId);

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-charcoal backdrop-blur-sm transition-colors hover:bg-ivory ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20s-7.5-4.8-10-9.5C.5 6.5 2.5 3 6 3c2 0 3.5 1 4 2.5C10.5 4 12 3 14 3c3.5 0 5.5 3.5 4 7.5C15.5 15.2 12 20 12 20z"
        />
      </svg>
    </button>
  );
}
