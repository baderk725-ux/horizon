export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";
export type PaymentMethod = "cod";

export const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "cancelled",
  "refunded",
];

/**
 * Mirrors validate_payment_status_transition() — the DB is the real source
 * of truth and rejects anything else regardless of this map. This only
 * drives which action buttons staff see, and deliberately never offers
 * "cancelled" as a manual target: cancellation only ever happens as a side
 * effect of cancelling the order itself (sync_payment_with_order_status),
 * never as a direct payment edit.
 */
export const NEXT_PAYMENT_STATUSES: Partial<Record<PaymentStatus, PaymentStatus[]>> = {
  pending: ["paid", "failed"],
  failed: ["pending"],
  paid: ["refunded"],
};
