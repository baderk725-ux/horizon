"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { resolveCartIdForCheckout } from "@/lib/cart/resolve";
import { getCartByCartId } from "@/lib/data/cart";

export type CouponFormState = { error: string | null };

/**
 * Validates via redeem_coupon() (pure, no side effects) before storing the
 * code on the cart — never trusts the client's own idea of whether a code
 * is valid. Storing an invalid/unvalidated code on the cart would be
 * harmless anyway (recompute_order_totals independently re-validates at
 * order-creation time and simply applies zero discount for a bad code),
 * but validating here means the customer gets clear feedback immediately
 * rather than a silently-ignored code at checkout.
 */
export async function applyCouponAction(
  _prev: CouponFormState,
  formData: FormData,
): Promise<CouponFormState> {
  const code = String(formData.get("code") ?? "").trim();
  if (!code) return { error: "code_required" };

  const cartId = await resolveCartIdForCheckout();
  if (!cartId) return { error: "empty_cart" };

  const cart = await getCartByCartId(cartId);
  if (cart.lines.length === 0) return { error: "empty_cart" };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("redeem_coupon", {
    p_code: code,
    p_subtotal: cart.subtotal,
  });

  if (error || !data) return { error: "not_found" };
  const result = data as { valid: boolean; reason?: string };
  if (!result.valid) return { error: result.reason ?? "not_found" };

  // Owner-scoped by carts RLS (user_id = auth.uid() OR user_id is null for
  // a guest's own cookie-bound cart) — never a generic patch, this is the
  // only field this action ever writes.
  const { error: updateError } = await supabase
    .from("carts")
    .update({ coupon_code: code.toUpperCase() })
    .eq("id", cartId);
  if (updateError) return { error: "save_failed" };

  revalidatePath("/cart");
  revalidatePath("/checkout");
  return { error: null };
}

export async function removeCouponAction(): Promise<CouponFormState> {
  const cartId = await resolveCartIdForCheckout();
  if (!cartId) return { error: null };

  const supabase = await createClient();
  const { error } = await supabase.from("carts").update({ coupon_code: null }).eq("id", cartId);
  if (error) return { error: "save_failed" };

  revalidatePath("/cart");
  revalidatePath("/checkout");
  return { error: null };
}
