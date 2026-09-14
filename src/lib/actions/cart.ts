"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ensureActiveCart } from "@/lib/cart/resolve";

export type CartActionState = { error: string | null };

const MAX_LINE_QUANTITY = 20;

export async function addToCartAction(
  productId: string,
  requestedQuantity: number = 1,
): Promise<CartActionState> {
  if (!Number.isFinite(requestedQuantity) || requestedQuantity < 1) {
    return { error: "invalid_quantity" };
  }

  const supabase = await createClient();

  // Never trust a client-supplied price or stock figure — re-read the
  // product from the public storefront view (retail pricing, respects
  // is_published) as the source of truth for whether this can be added.
  const { data: product } = await supabase
    .from("products_storefront")
    .select("id, stock_quantity")
    .eq("id", productId)
    .maybeSingle();

  if (!product) {
    return { error: "product_unavailable" };
  }

  const cart = await ensureActiveCart();

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cart.id)
    .eq("product_id", productId)
    .is("variant_id", null)
    .maybeSingle();

  const currentQty = existing?.quantity ?? 0;
  const nextQty = Math.min(
    currentQty + requestedQuantity,
    product.stock_quantity ?? 0,
    MAX_LINE_QUANTITY,
  );

  if (nextQty <= currentQty) {
    return { error: "out_of_stock" };
  }

  const { error } = existing
    ? await supabase.from("cart_items").update({ quantity: nextQty }).eq("id", existing.id)
    : await supabase.from("cart_items").insert({
        cart_id: cart.id,
        product_id: productId,
        quantity: nextQty,
      });

  if (error) return { error: "save_failed" };

  revalidatePath("/[locale]/cart", "page");
  revalidatePath("/[locale]", "page");
  return { error: null };
}

export async function updateCartItemQuantityAction(
  cartItemId: string,
  quantity: number,
): Promise<CartActionState> {
  if (!Number.isFinite(quantity) || quantity < 1) {
    return { error: "invalid_quantity" };
  }

  const supabase = await createClient();

  const { data: item } = await supabase
    .from("cart_items")
    .select("product_id")
    .eq("id", cartItemId)
    .maybeSingle();

  if (!item) return { error: "not_found" };

  const { data: product } = await supabase
    .from("products_storefront")
    .select("stock_quantity")
    .eq("id", item.product_id)
    .maybeSingle();

  const cappedQuantity = Math.min(
    quantity,
    product?.stock_quantity ?? 0,
    MAX_LINE_QUANTITY,
  );

  if (cappedQuantity < 1) {
    return { error: "out_of_stock" };
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity: cappedQuantity })
    .eq("id", cartItemId);

  if (error) return { error: "save_failed" };

  revalidatePath("/[locale]/cart", "page");
  return { error: null };
}

export async function removeCartItemAction(
  cartItemId: string,
): Promise<CartActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId);
  if (error) return { error: "save_failed" };

  revalidatePath("/[locale]/cart", "page");
  return { error: null };
}
