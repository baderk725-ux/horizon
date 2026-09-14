"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { couponSchema } from "@/lib/validation/discounts";

export type DiscountActionState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
};

/** Defense in depth: RLS (admin_has('products')) already blocks this at the
 * database level for anyone else — this just returns a clean error instead
 * of a raw Postgres permission failure. Coupons reuse the 'products' admin
 * area (same staff who manage catalog/pricing already manage discounts). */
async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

function readForm(formData: FormData) {
  return couponSchema.safeParse({
    code: formData.get("code"),
    discountType: formData.get("discountType"),
    value: formData.get("value"),
    minOrderAmount: formData.get("minOrderAmount") ?? "",
    maxUses: formData.get("maxUses") ?? "",
    expiresAt: formData.get("expiresAt") ?? "",
    isActive: formData.get("isActive") === "on",
  });
}

export async function createCouponAction(
  _prev: DiscountActionState,
  formData: FormData,
): Promise<DiscountActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readForm(formData);
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase.from("coupons").insert({
    code: parsed.data.code,
    discount_type: parsed.data.discountType,
    value: parsed.data.value,
    min_order_amount: parsed.data.minOrderAmount ?? null,
    max_uses: parsed.data.maxUses ?? null,
    expires_at: parsed.data.expiresAt ?? null,
    is_active: parsed.data.isActive,
  });

  if (error) {
    return { error: error.code === "23505" ? "code_taken" : "save_failed" };
  }

  revalidatePath("/admin/discounts");
  return { error: null };
}

export async function updateCouponAction(
  id: string,
  _prev: DiscountActionState,
  formData: FormData,
): Promise<DiscountActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readForm(formData);
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("coupons")
    .update({
      code: parsed.data.code,
      discount_type: parsed.data.discountType,
      value: parsed.data.value,
      min_order_amount: parsed.data.minOrderAmount ?? null,
      max_uses: parsed.data.maxUses ?? null,
      expires_at: parsed.data.expiresAt ?? null,
      is_active: parsed.data.isActive,
    })
    .eq("id", id);

  if (error) {
    return { error: error.code === "23505" ? "code_taken" : "save_failed" };
  }

  revalidatePath("/admin/discounts");
  return { error: null };
}

/** Toggling is_active off is preferred over delete for a coupon that has
 * ever been used (used_count > 0) — deleting it would erase which coupon a
 * past order's coupon_code text actually referred to for reporting. Delete
 * is still offered for coupons that were never used. */
export async function setCouponActiveAction(
  id: string,
  isActive: boolean,
): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { error } = await supabase.from("coupons").update({ is_active: isActive }).eq("id", id);
  if (error) return { error: "save_failed" };

  revalidatePath("/admin/discounts");
  return { error: null };
}

export async function deleteCouponAction(id: string): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return { error: "delete_failed" };

  revalidatePath("/admin/discounts");
  return { error: null };
}
