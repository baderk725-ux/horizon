"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { purchaseOrderSchema } from "@/lib/validation/purchase-orders";
import { NEXT_PO_STATUSES, type PurchaseOrderStatus } from "@/lib/purchase-orders/status";

export type PurchaseOrderActionState = { error: string | null };

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

function readItemsJson(formData: FormData): unknown {
  try {
    return JSON.parse(String(formData.get("itemsJson") ?? "[]"));
  } catch {
    return [];
  }
}

export async function createPurchaseOrderAction(
  _prev: PurchaseOrderActionState,
  formData: FormData,
): Promise<PurchaseOrderActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = purchaseOrderSchema.safeParse({
    supplierId: formData.get("supplierId") ?? "",
    notes: formData.get("notes") ?? "",
    items: readItemsJson(formData),
  });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { data: po, error } = await supabase
    .from("purchase_orders")
    // po_number is filled by generate_po_number() (BEFORE INSERT, only
    // when null) — the generated Insert type marks it required since the
    // column has no SQL-level DEFAULT, so it's passed explicitly as null
    // here rather than omitted.
    .insert({
      po_number: null as unknown as string,
      supplier_id: parsed.data.supplierId ?? null,
      notes: parsed.data.notes ?? null,
    })
    .select("id")
    .single();
  if (error || !po) return { error: "save_failed" };

  const { error: itemsError } = await supabase.from("purchase_order_items").insert(
    parsed.data.items.map((item) => ({
      purchase_order_id: po.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_cost: item.unitCost,
    })),
  );
  if (itemsError) {
    await supabase.from("purchase_orders").delete().eq("id", po.id);
    return { error: "save_failed" };
  }

  revalidatePath("/admin/purchase-orders");
  const locale = await getLocale();
  return redirect({ href: `/admin/purchase-orders/${po.id}`, locale });
}

/** Only reachable while the PO is still 'draft' — guard_received_po_items()
 * (DB-enforced regardless) also rejects this once status='received', but
 * the app additionally never offers editing once a PO has moved past
 * draft at all (ordered POs represent a real commitment already placed
 * with the supplier). */
export async function updatePurchaseOrderItemsAction(
  id: string,
  _prev: PurchaseOrderActionState,
  formData: FormData,
): Promise<PurchaseOrderActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = purchaseOrderSchema.safeParse({
    supplierId: formData.get("supplierId") ?? "",
    notes: formData.get("notes") ?? "",
    items: readItemsJson(formData),
  });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { data: current } = await supabase.from("purchase_orders").select("status").eq("id", id).maybeSingle();
  if (current?.status !== "draft") return { error: "not_editable" };

  const { error: updateError } = await supabase
    .from("purchase_orders")
    .update({ supplier_id: parsed.data.supplierId ?? null, notes: parsed.data.notes ?? null })
    .eq("id", id)
    .eq("status", "draft");
  if (updateError) return { error: "save_failed" };

  const { error: deleteError } = await supabase.from("purchase_order_items").delete().eq("purchase_order_id", id);
  if (deleteError) return { error: "save_failed" };

  const { error: insertError } = await supabase.from("purchase_order_items").insert(
    parsed.data.items.map((item) => ({
      purchase_order_id: id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_cost: item.unitCost,
    })),
  );
  if (insertError) return { error: "save_failed" };

  revalidatePath(`/admin/purchase-orders/${id}`);
  return { error: null };
}

/** Deliberately narrow: only ever sets `status`, stale-checked exactly
 * like every other status-transition action in this app. Marking
 * 'received' atomically adds stock for every line item via the pre-
 * existing receive_purchase_order() trigger — this action never touches
 * products.stock_quantity itself. */
export async function updatePurchaseOrderStatusAction(
  id: string,
  currentStatus: PurchaseOrderStatus,
  nextStatus: PurchaseOrderStatus,
): Promise<PurchaseOrderActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const allowed = NEXT_PO_STATUSES[currentStatus] ?? [];
  if (!allowed.includes(nextStatus)) return { error: "invalid_transition" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("purchase_orders")
    .update({ status: nextStatus })
    .eq("id", id)
    .eq("status", currentStatus)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.message?.includes("Invalid purchase order status transition")) {
      return { error: "invalid_transition" };
    }
    return { error: "update_failed" };
  }
  if (!data) return { error: "stale_or_unauthorized" };

  revalidatePath("/admin/purchase-orders");
  revalidatePath(`/admin/purchase-orders/${id}`);
  revalidatePath("/admin/inventory");
  return { error: null };
}
