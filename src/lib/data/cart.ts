import { createClient } from "@/lib/supabase/server";
import { resolveActiveCartId } from "@/lib/cart/resolve";

export type CartLine = {
  cartItemId: string;
  productId: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  image: string | null;
  unitPrice: number;
  quantity: number;
  availableStock: number;
  lineTotal: number;
};

export type CartSummary = {
  cartId: string | null;
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
};

const EMPTY_CART: CartSummary = { cartId: null, lines: [], itemCount: 0, subtotal: 0 };

/**
 * Priced live from `products_storefront` (never from anything stored on
 * the cart_items row — those only ever store product_id/variant_id/
 * quantity). Shared by getCart() (display, active carts only) and
 * getCartByCartId() (checkout retries, any status — see there for why).
 */
async function loadCartLines(cartId: string): Promise<Omit<CartSummary, "cartId">> {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("cart_items")
    .select("id, product_id, quantity")
    .eq("cart_id", cartId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!items || items.length === 0) {
    return { lines: [], itemCount: 0, subtotal: 0 };
  }

  const productIds = items.map((i) => i.product_id);
  const [{ data: products }, { data: images }] = await Promise.all([
    supabase.from("products_storefront").select("*").in("id", productIds),
    supabase
      .from("product_images")
      .select("product_id, url, sort_order")
      .in("product_id", productIds),
  ]);

  const productById = new Map((products ?? []).map((p) => [p.id!, p]));
  const imageByProduct = new Map<string, string>();
  for (const image of images ?? []) {
    if (!image.product_id) continue;
    if (!imageByProduct.has(image.product_id) || image.sort_order === 0) {
      imageByProduct.set(image.product_id, image.url);
    }
  }

  const lines: CartLine[] = [];
  for (const item of items) {
    const product = productById.get(item.product_id);
    // Product was unpublished/deleted since it was added — drop it from
    // the displayed cart rather than showing broken data. The row still
    // exists in cart_items; a future cleanup action could prune these.
    if (!product) continue;

    const unitPrice = product.retail_price ?? 0;
    lines.push({
      cartItemId: item.id,
      productId: item.product_id,
      slug: product.slug!,
      nameEn: product.name_en!,
      nameAr: product.name_ar!,
      image: imageByProduct.get(item.product_id) ?? null,
      unitPrice,
      quantity: item.quantity,
      availableStock: product.stock_quantity ?? 0,
      lineTotal: unitPrice * item.quantity,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  return { lines, itemCount, subtotal };
}

/** Cart contents for display (header badge, /cart page) — active carts only. */
export async function getCart(): Promise<CartSummary> {
  const cartId = await resolveActiveCartId();
  if (!cartId) return EMPTY_CART;
  return { cartId, ...(await loadCartLines(cartId)) };
}

/**
 * Checkout-only: reads a specific cart's items regardless of status
 * (active or already converted). Needed because a retried submission
 * (double-click, or a client retry after a request that actually
 * succeeded) arrives *after* the first attempt already marked the cart
 * converted — getCart()'s "active only" filter would otherwise make the
 * retry look like an empty cart before it ever reaches create_order()'s
 * own idempotency check.
 */
export async function getCartByCartId(cartId: string): Promise<CartSummary> {
  return { cartId, ...(await loadCartLines(cartId)) };
}
