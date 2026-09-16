"use client";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({ quantity, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center border border-line" role="group" aria-label="Quantity">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className="h-11 w-11 flex items-center justify-center text-charcoal hover:bg-cream transition-colors disabled:opacity-30"
      >
        −
      </button>
      <span className="w-10 text-center text-sm tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="h-11 w-11 flex items-center justify-center text-charcoal hover:bg-cream transition-colors disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
