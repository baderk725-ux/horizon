"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { createReturnSchema } from "@/lib/validation/returns";
import { NEXT_RETURN_STATUSES, type ReturnStatus } from "@/lib/returns/status";

export type ReturnActionState = { error: string | null };

/**
 * returns_insert RLS (order.customer_id = auth.uid() OR is_admin()) is the
 * real ownership check; validate_return_eligibility() (BEFORE INSERT) is
 * the real eligibility check (order must be shipped/delivered, no other
 * open return). This action only translates the DB's rejection into a
 * clean error code — it never decides eligibility itself.
 */
export async function createReturnAction(
  _prev: ReturnActionState,
  formData: FormData,
): Promise<ReturnActionState> {
  const current = await getCurrentUser();
  if (!current) return { error: "not_authorized" };

  const parsed = createReturnSchema.safeParse({
    orderId: formData.get("orderId"),
    reason: formData.get("reason"),
    reasonNotes: formData.get("reasonNotes") ?? "",
  });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase.from("returns").insert({
    order_id: parsed.data.orderId,
    reason: parsed.data.reason,
    reason_notes: parsed.data.reasonNotes ?? null,
  });

  if (error) {
    const message = error.message ?? "";
    if (message.includes("order_not_eligible_for_return")) return { error: "order_not_eligible_for_return" };
    if (message.includes("return_already_open")) return { error: "return_already_open" };
    if (message.includes("order_not_found")) return { error: "not_authorized" };
    return { error: "save_failed" };
  }

  revalidatePath("/account/orders");
  return { error: null };
}

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

/**
 * Deliberately narrow: only ever sets `status`, stale-checked exactly like
 * updateOrderStatusAction/updatePaymentStatusAction. The DB stays
 * authoritative regardless — validate_return_status_transition rejects
 * anything not in its own table, and a transition to 'completed' atomically
 * fires sync_order_and_payment_on_return_complete (stock restore, order ->
 * 'returned', payment -> refunded/cancelled) in the same statement.
 */
export async function updateReturnStatusAction(
  returnId: string,
  currentStatus: ReturnStatus,
  nextStatus: ReturnStatus,
): Promise<ReturnActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const allowed = NEXT_RETURN_STATUSES[currentStatus] ?? [];
  if (!allowed.includes(nextStatus)) {
    return { error: "invalid_transition" };
  }

  const current = await getCurrentUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("returns")
    .update({ status: nextStatus, resolved_by_admin_id: current?.userId ?? null })
    .eq("id", returnId)
    .eq("status", currentStatus)
    .select("id")
    .maybeSingle();

  if (error) {
    const message = error.message ?? "";
    if (message.includes("Invalid return status transition")) {
      return { error: "invalid_transition" };
    }
    return { error: "update_failed" };
  }

  if (!data) {
    return { error: "stale_or_unauthorized" };
  }

  revalidatePath("/admin/returns");
  revalidatePath(`/admin/returns/${returnId}`);
  return { error: null };
}
