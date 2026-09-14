export type PurchaseOrderStatus = "draft" | "ordered" | "received" | "cancelled";

export const PURCHASE_ORDER_STATUSES: PurchaseOrderStatus[] = ["draft", "ordered", "received", "cancelled"];

/** Mirrors validate_purchase_order_transition() — the DB is the real
 * source of truth. received and cancelled are both terminal here. */
export const NEXT_PO_STATUSES: Partial<Record<PurchaseOrderStatus, PurchaseOrderStatus[]>> = {
  draft: ["ordered", "cancelled"],
  ordered: ["received", "cancelled"],
};
