"use server";

import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";
import { checkoutSchema } from "@/lib/validation/checkout";
import { getCurrentUser } from "@/lib/data/auth";
import { getCartByCartId } from "@/lib/data/cart";
import { resolveCartIdForCheckout } from "@/lib/cart/resolve";
import type { Database } from "@/lib/supabase/database.types";

export type CheckoutActionState = {
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

export async function submitOrderAction(
  _prev: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const parsed = checkoutSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    governorateId: formData.get("governorateId"),
    areaId: formData.get("areaId"),
    fullAddress: formData.get("fullAddress"),
    notes: formData.get("notes") ?? "",
    termsAccepted: formData.get("termsAccepted") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "invalid_input", fieldErrors };
  }

  // Status-agnostic: a retry after the cart was already converted by a
  // prior successful (from the DB's perspective) submission must still
  // resolve to the same cart, so its id can reach create_order() as the
  // idempotency key below — getCart() (active-only) would otherwise make
  // a retry look like an empty cart.
  const cartId = await resolveCartIdForCheckout();
  if (!cartId) {
    return { error: "empty_cart" };
  }
  const cart = await getCartByCartId(cartId);
  if (cart.lines.length === 0) {
    return { error: "empty_cart" };
  }

  const current = await getCurrentUser();
  const supabase = await createClient();

  const items = cart.lines.map((line) => ({
    product_id: line.productId,
    quantity: line.quantity,
  }));

  // The cart's own id is already unique-per-checkout-attempt and stable
  // across retries of the same submission (double-click, browser retry
  // after a timed-out-but-actually-successful request) — no separate
  // client-generated token needed.
  const idempotencyKey = `cart:${cartId}`;

  const rpcArgs = {
    p_order_type: "retail",
    p_customer_id: current?.userId ?? null,
    p_guest_name: parsed.data.fullName,
    p_guest_phone: parsed.data.phone,
    p_guest_email: parsed.data.email || null,
    p_governorate_id: parsed.data.governorateId,
    p_area_id: parsed.data.areaId,
    p_full_address: parsed.data.fullAddress,
    p_notes: parsed.data.notes || null,
    p_coupon_code: cart.couponCode,
    p_items: items,
    p_idempotency_key: idempotencyKey,
  } as unknown as Database["public"]["Functions"]["create_order"]["Args"];

  const { data, error } = await supabase.rpc("create_order", rpcArgs);

  if (error || !data) {
    const message = error?.message ?? "";
    const knownError = [...KNOWN_RPC_ERRORS].find((code) => message.includes(code));
    return { error: knownError ?? "order_failed" };
  }

  const result = data as {
    order_number: string;
    total: number;
    subtotal: number;
    delivery_fee: number;
    discount_amount: number;
  };

  // The cart's job is done — retire it. cart_items are left as a
  // historical record (converted, not deleted); the next visit resolves
  // a fresh active cart since this one no longer matches status='active'.
  // Idempotent itself: a retry marking an already-converted cart converted
  // again is a harmless no-op.
  await supabase.from("carts").update({ status: "converted" }).eq("id", cartId);

  const locale = await getLocale();
  const params = new URLSearchParams({
    number: result.order_number,
    total: result.total.toFixed(2),
    subtotal: result.subtotal.toFixed(2),
    delivery: result.delivery_fee.toFixed(2),
    items: String(cart.itemCount),
  });

  return redirect({
    href: { pathname: "/order-confirmation", query: Object.fromEntries(params) },
    locale,
  });
}
