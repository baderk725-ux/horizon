import { clsx } from "clsx";
import type { ReturnStatus } from "@/lib/returns/status";

const COLORS: Record<ReturnStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-brand-200 text-brand-700",
  completed: "bg-green-100 text-green-800",
};

export function ReturnStatusBadge({ status, label }: { status: ReturnStatus; label: string }) {
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
