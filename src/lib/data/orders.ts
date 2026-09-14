import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/auth";

export type VerifiedOrderTotals = {
  orderNumber: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
};

/**
 * Looks up an order by number, scoped to the signed-in customer who owns it
 * (orders_select_own_or_admin RLS is the real gate; `.eq("customer_id", ...)`
 * here just keeps a mismatched guess from ever reaching a different
 * customer's row). Used by the order-confirmation page to render real DB
 * totals instead of trusting whatever numbers are sitting in the URL —
 * returns null for a guest session or an unmatched/foreign order number,
 * in which case the caller falls back to the (unverified) URL values.
 */
export async function getVerifiedOrderTotals(orderNumber: string): Promise<VerifiedOrderTotals | null> {
  const current = await getCurrentUser();
  if (!current) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("order_number, total, subtotal, delivery_fee")
    .eq("order_number", orderNumber)
    .eq("customer_id", current.userId)
    .maybeSingle();
  if (!data) return null;

  return {
    orderNumber: data.order_number,
    total: data.total,
    subtotal: data.subtotal,
    deliveryFee: data.delivery_fee,
  };
}

export type MyOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  returnStatus: string | null;
  returnId: string | null;
};

/** The signed-in customer's own orders — orders_select_own_or_admin RLS
 * (customer_id = auth.uid()) is what actually scopes this, not the query. */
export async function getMyOrders(userId: string): Promise<MyOrder[]> {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at")
    .eq("customer_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const orderRows = orders ?? [];
  if (orderRows.length === 0) return [];

  const { data: returns } = await supabase
    .from("returns")
    .select("id, order_id, status")
    .in(
      "order_id",
      orderRows.map((o) => o.id),
    );
  const returnByOrder = new Map((returns ?? []).map((r) => [r.order_id, r]));

  return orderRows.map((o) => {
    const r = returnByOrder.get(o.id);
    return {
      id: o.id,
      orderNumber: o.order_number,
      status: o.status,
      total: o.total,
      createdAt: o.created_at,
      returnStatus: r?.status ?? null,
      returnId: r?.id ?? null,
    };
  });
}

/** Eligible for a new return request: shipped/delivered, and no existing
 * open (pending/approved) return — mirrors validate_return_eligibility()
 * exactly, so the UI never offers an action the DB would reject anyway. */
export function isReturnEligible(order: MyOrder): boolean {
  const shippedOrDelivered = order.status === "shipped" || order.status === "delivered";
  const hasOpenReturn = order.returnStatus === "pending" || order.returnStatus === "approved";
  return shippedOrDelivered && !hasOpenReturn;
}
