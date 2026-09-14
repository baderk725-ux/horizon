"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { stockAdjustSchema } from "@/lib/validation/inventory";

export type InventoryActionState = { error: string | null };

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

/**
 * Deliberately narrow: only ever writes stock_quantity and
 * low_stock_threshold. RLS (products_update: admin_has('products') OR
 * admin_has('inventory')) already lets warehouse-role staff reach this at
 * all, and restrict_product_update_columns() (BEFORE UPDATE, DB-enforced
 * regardless of what this action sends) independently rejects any attempt
 * by a non-'products'-role caller to change anything else — name, price,
 * publish state, etc. This action's own narrowness is defense in depth on
 * top of that, not the only thing preventing scope creep.
 */
export async function updateProductStockAction(
  productId: string,
  _prev: InventoryActionState,
  formData: FormData,
): Promise<InventoryActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = stockAdjustSchema.safeParse({
    stockQuantity: formData.get("stockQuantity"),
    lowStockThreshold: formData.get("lowStockThreshold"),
  });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      stock_quantity: parsed.data.stockQuantity,
      low_stock_threshold: parsed.data.lowStockThreshold,
    })
    .eq("id", productId);

  if (error) return { error: "save_failed" };

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  return { error: null };
}
