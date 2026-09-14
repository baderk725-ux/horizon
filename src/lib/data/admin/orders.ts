import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { OrderStatus } from "@/lib/orders/status";

export type { OrderStatus } from "@/lib/orders/status";
export { ORDER_STATUSES, NEXT_STATUSES } from "@/lib/orders/status";

export type AdminOrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type AdminOrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];

const PAGE_SIZE = 20;

export type AdminOrderListItem = AdminOrderRow & {
  customer: { full_name: string | null; email: string | null } | null;
};

export async function getAdminOrders(params: {
  status?: OrderStatus;
  search?: string;
  page?: number;
}): Promise<{ orders: AdminOrderListItem[]; total: number; page: number; pageCount: number }> {
  const supabase = await createClient();
  const page = Math.max(1, params.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("orders")
    .select("*, customer:profiles!orders_customer_id_fkey(full_name, email)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (params.status) query = query.eq("status", params.status);
  if (params.search?.trim()) {
    const term = params.search.trim();
    query = query.or(
      `order_number.ilike.%${term}%,guest_name.ilike.%${term}%,guest_phone.ilike.%${term}%`,
    );
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  return {
    orders: (data ?? []) as AdminOrderListItem[],
    total: count ?? 0,
    page,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
  };
}

export type AdminOrderDetail = AdminOrderRow & {
  customer: { full_name: string | null; email: string | null; phone: string | null } | null;
  governorate: { name_en: string; name_ar: string } | null;
  area: { name_en: string; name_ar: string; delivery_fee: number } | null;
  createdByAdmin: { full_name: string | null } | null;
  items: AdminOrderItemRow[];
  payment: Database["public"]["Tables"]["payments"]["Row"] | null;
  timeline: {
    id: string;
    action: string;
    description: string | null;
    created_at: string;
    admin_name: string | null;
  }[];
};

export async function getAdminOrderById(id: string): Promise<AdminOrderDetail | null> {
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "*, customer:profiles!orders_customer_id_fkey(full_name, email, phone), governorate:governorates(name_en, name_ar), area:delivery_areas(name_en, name_ar, delivery_fee), createdByAdmin:profiles!orders_created_by_admin_id_fkey(full_name)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!order) return null;

  const [{ data: items }, { data: activity }, { data: payment }] = await Promise.all([
    supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("admin_activity_log")
      .select("id, action, description, created_at, admin:profiles(full_name)")
      .eq("entity_type", "order")
      .eq("entity_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("payments").select("*").eq("order_id", id).maybeSingle(),
  ]);

  return {
    ...(order as unknown as AdminOrderRow & {
      customer: AdminOrderDetail["customer"];
      governorate: AdminOrderDetail["governorate"];
      area: AdminOrderDetail["area"];
      createdByAdmin: AdminOrderDetail["createdByAdmin"];
    }),
    items: items ?? [],
    payment: payment ?? null,
    timeline: (activity ?? []).map((entry) => ({
      id: entry.id,
      action: entry.action,
      description: entry.description,
      created_at: entry.created_at,
      admin_name:
        (entry.admin as unknown as { full_name: string | null } | null)?.full_name ?? null,
    })),
  };
}
