import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { ReturnStatus } from "@/lib/returns/status";

export type { ReturnStatus } from "@/lib/returns/status";
export { RETURN_STATUSES, NEXT_RETURN_STATUSES } from "@/lib/returns/status";

export type AdminReturnRow = Database["public"]["Tables"]["returns"]["Row"];

export type AdminReturnListItem = AdminReturnRow & {
  order: {
    order_number: string;
    status: string;
    guest_name: string | null;
    customer: { full_name: string | null } | null;
  } | null;
};

export async function getAdminReturns(params: {
  status?: ReturnStatus;
}): Promise<AdminReturnListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("returns")
    .select(
      "*, order:orders!returns_order_id_fkey(order_number, status, guest_name, customer:profiles!orders_customer_id_fkey(full_name))",
    )
    .order("created_at", { ascending: false });

  if (params.status) query = query.eq("status", params.status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as AdminReturnListItem[];
}

export type AdminReturnDetail = AdminReturnRow & {
  order: {
    id: string;
    order_number: string;
    status: string;
    total: number;
    guest_name: string | null;
    guest_phone: string | null;
    customer: { full_name: string | null; phone: string | null } | null;
    items: { product_name_en: string; product_name_ar: string; quantity: number; unit_price: number }[];
  } | null;
};

export async function getAdminReturnById(id: string): Promise<AdminReturnDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("returns")
    .select(
      "*, order:orders!returns_order_id_fkey(id, order_number, status, total, guest_name, guest_phone, customer:profiles!orders_customer_id_fkey(full_name, phone), items:order_items(product_name_en, product_name_ar, quantity, unit_price))",
    )
    .eq("id", id)
    .maybeSingle();

  return (data as unknown as AdminReturnDetail) ?? null;
}
