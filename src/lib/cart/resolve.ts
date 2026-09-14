import { createClient } from "@/lib/supabase/server";
import { readGuestCartId, writeGuestCartId, clearGuestCartId } from "@/lib/cart/session";
import type { Database } from "@/lib/supabase/database.types";

type CartRow = Database["public"]["Tables"]["carts"]["Row"];

/**
 * Read-only cart-id resolution — safe for Server Components (no cookie
 * writes). Signed-in users are looked up by their own active cart row;
 * guests are looked up by the cart id in their cookie. Returns null when
 * there is genuinely no cart yet (an empty cart, not an error).
 */
export async function resolveActiveCartId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();
    return data?.id ?? null;
  }

  const guestCartId = await readGuestCartId();
  if (!guestCartId) return null;

  const { data } = await supabase
    .from("carts")
    .select("id")
    .eq("id", guestCartId)
    .eq("status", "active")
    .maybeSingle();
  return data?.id ?? null;
}

/**
 * Checkout-only variant of resolveActiveCartId: matches by ownership
 * (user_id or the guest cookie) regardless of the cart's status. A cart
 * that a prior submission already converted still needs to resolve here
 * so a retried checkout request can reach create_order()'s own
 * idempotency check instead of looking like an empty cart.
 */
export async function resolveCartIdForCheckout(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data?.id ?? null;
  }

  const guestCartId = await readGuestCartId();
  if (!guestCartId) return null;

  const { data } = await supabase
    .from("carts")
    .select("id")
    .eq("id", guestCartId)
    .maybeSingle();
  return data?.id ?? null;
}

/**
 * Get-or-create — only callable from a Server Action (writes the guest
 * cookie when a new guest cart is created). Also merges a guest cart into
 * the user's cart the first time a signed-in user is resolved after having
 * shopped as a guest.
 */
export async function ensureActiveCart(): Promise<CartRow> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const guestCartId = await readGuestCartId();

  if (user) {
    const { data: existing } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (existing) {
      if (guestCartId && guestCartId !== existing.id) {
        await mergeCartItems(guestCartId, existing.id);
        await clearGuestCartId();
      }
      return existing;
    }

    // No cart yet for this user: claim the guest cart (if any) instead of
    // creating a second one, so quantities/items survive sign-in.
    if (guestCartId) {
      const { data: claimed } = await supabase
        .from("carts")
        .update({ user_id: user.id })
        .eq("id", guestCartId)
        .is("user_id", null)
        .eq("status", "active")
        .select("*")
        .maybeSingle();
      if (claimed) return claimed;
    }

    const { data: created, error } = await supabase
      .from("carts")
      .insert({ user_id: user.id })
      .select("*")
      .single();
    if (error || !created) throw error ?? new Error("Failed to create cart");
    return created;
  }

  // Guest
  if (guestCartId) {
    const { data: existing } = await supabase
      .from("carts")
      .select("*")
      .eq("id", guestCartId)
      .eq("status", "active")
      .maybeSingle();
    if (existing) return existing;
  }

  const { data: created, error } = await supabase
    .from("carts")
    .insert({})
    .select("*")
    .single();
  if (error || !created) throw error ?? new Error("Failed to create cart");

  await writeGuestCartId(created.id);
  return created;
}

/** Merge item quantities from a guest cart into the destination cart, then
 * retire the guest cart. Runs quantities additively per product/variant. */
async function mergeCartItems(fromCartId: string, toCartId: string) {
  const supabase = await createClient();

  const { data: fromItems } = await supabase
    .from("cart_items")
    .select("product_id, variant_id, quantity")
    .eq("cart_id", fromCartId);

  for (const item of fromItems ?? []) {
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", toCartId)
      .eq("product_id", item.product_id)
      .is("variant_id", null)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + item.quantity })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({
        cart_id: toCartId,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
      });
    }
  }

  await supabase.from("carts").delete().eq("id", fromCartId);
}
