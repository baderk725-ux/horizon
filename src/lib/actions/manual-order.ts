"use server";

import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";
import { manualOrderSchema } from "@/lib/validation/manual-order";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import type { Database } from "@/lib/supabase/database.types";

export type ManualOrderActionState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
};

const KNOWN_RPC_ERRORS = new Set([
  "not_authorized",
  "empty_cart",
  "invalid_quantity",
  "product_unavailable",
  "insufficient_stock",
]);

export async function createManualOrderAction(
  _prev: ManualOrderActionState,
  formData: FormData,
): Promise<ManualOrderActionState> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) {
    return { error: "not_authorized" };
  }

  const parsed = manualOrderSchema.safeParse({
    manualCustomerId: formData.get("manualCustomerId") ?? "",
    saveAsNewCustomer: formData.get("saveAsNewCustomer") === "on",
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    governorateId: formData.get("governorateId"),
    areaId: formData.get("areaId"),
    fullAddress: formData.get("fullAddress"),
    notes: formData.get("notes") ?? "",
    internalNotes: formData.get("internalNotes") ?? "",
    items: formData.get("items") ?? "[]",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "invalid_input", fieldErrors };
  }

  const supabase = await createClient();

  let manualCustomerId = parsed.data.manualCustomerId || null;

  // Optionally save this as a new manual customer record for next time —
  // a plain insert (RLS: admin_has('customers'), already verified this
  // caller is admin above). If it fails, the order can still proceed as a
  // one-off guest-style entry rather than blocking the whole submission.
  if (!manualCustomerId && parsed.data.saveAsNewCustomer) {
    const { data: newCustomer } = await supabase
      .from("manual_customers")
      .insert({
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        address: parsed.data.fullAddress,
      })
      .select("id")
      .maybeSingle();
    manualCustomerId = newCustomer?.id ?? null;
  }

  const idempotencyKey = String(formData.get("idempotencyKey") ?? "");

  const rpcArgs = {
    p_order_type: "retail",
    p_customer_id: null,
    p_guest_name: parsed.data.fullName,
    p_guest_phone: parsed.data.phone,
    p_guest_email: parsed.data.email || null,
    p_governorate_id: parsed.data.governorateId,
    p_area_id: parsed.data.areaId,
    p_full_address: parsed.data.fullAddress,
    p_notes: parsed.data.notes || null,
    p_coupon_code: null,
    p_items: parsed.data.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    })),
    p_idempotency_key: idempotencyKey || null,
    p_order_source: "manual",
    p_manual_customer_id: manualCustomerId,
    p_internal_notes: parsed.data.internalNotes || null,
  } as unknown as Database["public"]["Functions"]["create_order"]["Args"];

  const { data, error } = await supabase.rpc("create_order", rpcArgs);

  if (error || !data) {
    const message = error?.message ?? "";
    const knownError = [...KNOWN_RPC_ERRORS].find((code) => message.includes(code));
    return { error: knownError ?? "order_failed" };
  }

  const result = data as { order_id: string };
  const locale = await getLocale();
  return redirect({ href: `/admin/orders/${result.order_id}`, locale });
}
