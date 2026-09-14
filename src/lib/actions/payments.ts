"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { NEXT_PAYMENT_STATUSES, type PaymentStatus } from "@/lib/payments/status";

export type PaymentActionState = { error: string | null };

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

/**
 * Deliberately narrow, exactly like updateOrderStatusAction: only ever sets
 * `status`, pinned with .eq("status", currentStatus) so a stale or duplicate
 * submission (double-click on "mark collected") matches zero rows instead
 * of re-applying a transition against state the admin never saw. The DB
 * stays authoritative regardless: validate_payment_status_transition
 * rejects anything not in its own table, guard_payment_immutable_fields
 * blocks amount/method/order_id from ever moving through UPDATE, and
 * stamp_payment_status_change sets paid_at/confirmed_by_admin_id itself —
 * none of that is client-suppliable.
 */
export async function updatePaymentStatusAction(
  paymentId: string,
  currentStatus: PaymentStatus,
  nextStatus: PaymentStatus,
  orderId: string,
): Promise<PaymentActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const allowed = NEXT_PAYMENT_STATUSES[currentStatus] ?? [];
  if (!allowed.includes(nextStatus)) {
    return { error: "invalid_transition" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .update({ status: nextStatus })
    .eq("id", paymentId)
    .eq("status", currentStatus)
    .select("id")
    .maybeSingle();

  if (error) {
    const message = error.message ?? "";
    if (message.includes("Invalid payment status transition")) {
      return { error: "invalid_transition" };
    }
    return { error: "update_failed" };
  }

  if (!data) {
    return { error: "stale_or_unauthorized" };
  }

  revalidatePath("/admin/payments");
  revalidatePath(`/admin/orders/${orderId}`);
  return { error: null };
}
