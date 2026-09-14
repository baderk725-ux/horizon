import { clsx } from "clsx";
import type { OrderStatus } from "@/lib/orders/status";

const COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-brand-200 text-brand-700",
  returned: "bg-red-100 text-red-800",
};

export function OrderStatusBadge({ status, label }: { status: OrderStatus; label: string }) {
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
