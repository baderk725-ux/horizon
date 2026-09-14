"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { NEXT_STATUSES, type OrderStatus } from "@/lib/data/admin/orders";

export type OrderActionState = { error: string | null };

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

/**
 * Deliberately narrow: this only ever sets `status`, never a generic
 * order-patch. The DB is still the real authority — validate_order_status_
 * transition (BEFORE UPDATE) rejects anything not in its own transition
 * table regardless of what NEXT_STATUSES offers in the UI, and
 * apply_stock_on_status_change (also BEFORE UPDATE, same statement)
 * deducts/restores stock atomically with this same update. A concurrent or
 * retried identical call is safe: Postgres serializes on the row lock, and
 * the second call's old.status already equals new.status by the time it
 * runs, which the transition trigger treats as a no-op rather than an
 * error.
 */
export async function updateOrderStatusAction(
  orderId: string,
  currentStatus: OrderStatus,
  nextStatus: OrderStatus,
): Promise<OrderActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const allowed = NEXT_STATUSES[currentStatus] ?? [];
  if (!allowed.includes(nextStatus)) {
    return { error: "invalid_transition" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ status: nextStatus })
    // Belt-and-suspenders against a stale UI: only actually apply if the
    // row is still in the status the admin saw. If someone else already
    // moved it, this matches zero rows instead of silently re-applying a
    // transition against state the admin never saw.
    .eq("id", orderId)
    .eq("status", currentStatus)
    .select("id")
    .maybeSingle();

  if (error) {
    const message = error.message ?? "";
    if (message.includes("Invalid order status transition")) {
      return { error: "invalid_transition" };
    }
    return { error: "update_failed" };
  }

  if (!data) {
    // Either RLS blocked it (not actually admin_has('orders')) or the
    // order's status changed since the admin loaded the page.
    return { error: "stale_or_unauthorized" };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { error: null };
}

export async function updateOrderInternalNotesAction(
  orderId: string,
  notes: string,
): Promise<OrderActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ internal_notes: notes.trim() || null })
    .eq("id", orderId)
    .select("id")
    .maybeSingle();

  if (error) return { error: "update_failed" };
  if (!data) return { error: "stale_or_unauthorized" };

  revalidatePath(`/admin/orders/${orderId}`);
  return { error: null };
}
