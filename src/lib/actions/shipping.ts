"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { governorateSchema, deliveryAreaSchema } from "@/lib/validation/shipping";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";

export type ShippingActionState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
};

/** Defense in depth: RLS (admin_has('delivery'), manager/super_admin
 * only) already blocks this at the database level for anyone else — this
 * just returns a clean error instead of a raw Postgres permission
 * failure. */
async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

export async function createGovernorateAction(
  _prev: ShippingActionState,
  formData: FormData,
): Promise<ShippingActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = governorateSchema.safeParse({
    nameEn: formData.get("nameEn"),
    nameAr: formData.get("nameAr"),
  });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase.from("governorates").insert({
    name_en: parsed.data.nameEn,
    name_ar: parsed.data.nameAr,
  });
  if (error) return { error: "save_failed" };

  revalidatePath("/admin/shipping");
  return { error: null };
}

export async function deleteGovernorateAction(
  id: string,
): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();

  // delivery_areas.governorate_id is ON DELETE CASCADE, so deleting a
  // governorate silently removes its areas too unless one of them is
  // already referenced by a real order (orders.area_id has no ON DELETE
  // action, so that reference blocks the cascade and the whole delete
  // fails safely) — but a governorate with *unused* areas would still
  // cascade-delete them without this pre-check warning the admin first.
  const { count: areaCount } = await supabase
    .from("delivery_areas")
    .select("id", { count: "exact", head: true })
    .eq("governorate_id", id);

  if ((areaCount ?? 0) > 0) {
    return { error: "governorate_has_areas" };
  }

  const { error } = await supabase.from("governorates").delete().eq("id", id);
  if (error) {
    return { error: error.code === "23503" ? "governorate_in_use" : "delete_failed" };
  }

  revalidatePath("/admin/shipping");
  return { error: null };
}

function readAreaForm(formData: FormData) {
  return deliveryAreaSchema.safeParse({
    governorateId: formData.get("governorateId"),
    nameEn: formData.get("nameEn"),
    nameAr: formData.get("nameAr"),
    deliveryFee: formData.get("deliveryFee") || 0,
    freeDeliveryThreshold: formData.get("freeDeliveryThreshold") ?? "",
    isActive: formData.get("isActive") === "on",
    isConfigured: formData.get("isConfigured") === "on",
  });
}

export async function createDeliveryAreaAction(
  _prev: ShippingActionState,
  formData: FormData,
): Promise<ShippingActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readAreaForm(formData);
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase.from("delivery_areas").insert({
    governorate_id: parsed.data.governorateId,
    name_en: parsed.data.nameEn,
    name_ar: parsed.data.nameAr,
    delivery_fee: parsed.data.deliveryFee,
    free_delivery_threshold: parsed.data.freeDeliveryThreshold ?? null,
    is_active: parsed.data.isActive,
    is_configured: parsed.data.isConfigured,
  });
  if (error) return { error: "save_failed" };

  revalidatePath("/admin/shipping");
  return { error: null };
}

export async function updateDeliveryAreaAction(
  id: string,
  _prev: ShippingActionState,
  formData: FormData,
): Promise<ShippingActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readAreaForm(formData);
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("delivery_areas")
    .update({
      governorate_id: parsed.data.governorateId,
      name_en: parsed.data.nameEn,
      name_ar: parsed.data.nameAr,
      delivery_fee: parsed.data.deliveryFee,
      free_delivery_threshold: parsed.data.freeDeliveryThreshold ?? null,
      is_active: parsed.data.isActive,
      is_configured: parsed.data.isConfigured,
    })
    .eq("id", id);
  if (error) return { error: "save_failed" };

  revalidatePath("/admin/shipping");
  return { error: null };
}

export async function deleteDeliveryAreaAction(
  id: string,
): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { error } = await supabase.from("delivery_areas").delete().eq("id", id);
  if (error) {
    // orders.area_id has no ON DELETE action — a real order referencing
    // this area blocks the delete rather than orphaning delivery history.
    return { error: error.code === "23503" ? "area_in_use" : "delete_failed" };
  }

  revalidatePath("/admin/shipping");
  return { error: null };
}

/**
 * Sets status='shipped' and tracking_number together in a single UPDATE —
 * shipping state and the order lifecycle move atomically, never as two
 * separate writes that could partially fail. validate_order_status_
 * transition still enforces this is a legal transition from the order's
 * current status regardless of what's passed here.
 */
export async function markOrderShippedAction(
  orderId: string,
  currentStatus: string,
  trackingNumber: string,
): Promise<ShippingActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  if (currentStatus !== "processing") {
    return { error: "invalid_transition" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .update({
      status: "shipped",
      tracking_number: trackingNumber.trim() || null,
    })
    .eq("id", orderId)
    .eq("status", "processing")
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.message?.includes("Invalid order status transition")) {
      return { error: "invalid_transition" };
    }
    return { error: "update_failed" };
  }
  if (!data) return { error: "stale_or_unauthorized" };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { error: null };
}
