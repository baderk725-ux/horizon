import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { PurchaseOrderStatus } from "@/lib/purchase-orders/status";

export type { PurchaseOrderStatus } from "@/lib/purchase-orders/status";
export { PURCHASE_ORDER_STATUSES, NEXT_PO_STATUSES } from "@/lib/purchase-orders/status";

export type PurchaseOrderRow = Database["public"]["Tables"]["purchase_orders"]["Row"];

export type AdminPurchaseOrderListItem = PurchaseOrderRow & {
  supplier: { name: string } | null;
  itemCount: number;
};

export async function getAdminPurchaseOrders(params: {
  status?: PurchaseOrderStatus;
}): Promise<AdminPurchaseOrderListItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("purchase_orders")
    .select("*, supplier:suppliers(name), purchase_order_items(id)")
    .order("created_at", { ascending: false });
  if (params.status) query = query.eq("status", params.status);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => {
    const { purchase_order_items, ...rest } = row as typeof row & {
      purchase_order_items: { id: string }[];
    };
    return { ...rest, itemCount: purchase_order_items.length };
  });
}

export type PurchaseOrderItemLine = {
  id: string;
  productId: string | null;
  nameEn: string | null;
  nameAr: string | null;
  quantity: number;
  unitCost: number;
};

export type AdminPurchaseOrderDetail = PurchaseOrderRow & {
  supplier: { id: string; name: string } | null;
  items: PurchaseOrderItemLine[];
};

export async function getAdminPurchaseOrderById(id: string): Promise<AdminPurchaseOrderDetail | null> {
  const supabase = await createClient();
  const { data: po } = await supabase
    .from("purchase_orders")
    .select("*, supplier:suppliers(id, name)")
    .eq("id", id)
    .maybeSingle();
  if (!po) return null;

  const { data: items } = await supabase
    .from("purchase_order_items")
    .select("id, product_id, quantity, unit_cost, product:products(name_en, name_ar)")
    .eq("purchase_order_id", id);

  const lines: PurchaseOrderItemLine[] = (items ?? []).map((item) => {
    const product = item.product as unknown as { name_en: string; name_ar: string } | null;
    return {
      id: item.id,
      productId: item.product_id,
      nameEn: product?.name_en ?? null,
      nameAr: product?.name_ar ?? null,
      quantity: item.quantity,
      unitCost: item.unit_cost,
    };
  });

  return { ...po, items: lines } as AdminPurchaseOrderDetail;
}
