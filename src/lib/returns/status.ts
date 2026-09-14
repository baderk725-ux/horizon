export type ReturnStatus = "pending" | "approved" | "rejected" | "completed";

export const RETURN_STATUSES: ReturnStatus[] = ["pending", "approved", "rejected", "completed"];

/**
 * Mirrors validate_return_status_transition() — the DB is the real source
 * of truth. rejected and completed are both terminal from here: a
 * rejected request needs a fresh return, and completed has already fired
 * the order/stock/payment side effects (sync_order_and_payment_on_return_
 * complete), so it's never a status to edit back out of.
 */
export const NEXT_RETURN_STATUSES: Partial<Record<ReturnStatus, ReturnStatus[]>> = {
  pending: ["approved", "rejected"],
  approved: ["completed"],
};
