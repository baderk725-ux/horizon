import { clsx } from "clsx";
import type { PaymentStatus } from "@/lib/payments/status";

const COLORS: Record<PaymentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-brand-200 text-brand-700",
  refunded: "bg-indigo-100 text-indigo-800",
};

export function PaymentStatusBadge({ status, label }: { status: PaymentStatus; label: string }) {
  return (
    <span
      className={clsx(
        "inline-block rounded-(--radius-pill) px-3 py-1 text-xs font-medium",
        COLORS[status],
      )}
    >
      {label}
    </span>
  );
}
