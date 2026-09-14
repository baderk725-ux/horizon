import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { PaymentStatus } from "@/lib/payments/status";

export type { PaymentStatus, PaymentMethod } from "@/lib/payments/status";
export { PAYMENT_STATUSES, NEXT_PAYMENT_STATUSES } from "@/lib/payments/status";

export type AdminPaymentRow = Database["public"]["Tables"]["payments"]["Row"];

const PAGE_SIZE = 20;

export type AdminPaymentListItem = AdminPaymentRow & {
  order: {
    order_number: string;
    status: string;
    guest_name: string | null;
    customer: { full_name: string | null } | null;
  } | null;
};

export async function getAdminPayments(params: {
  status?: PaymentStatus;
  search?: string;
  page?: number;
}): Promise<{ payments: AdminPaymentListItem[]; total: number; page: number; pageCount: number }> {
  const supabase = await createClient();
  const page = Math.max(1, params.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("payments")
    .select(
      "*, order:orders!payments_order_id_fkey(order_number, status, guest_name, customer:profiles!orders_customer_id_fkey(full_name))",
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (params.status) query = query.eq("status", params.status);

  const term = params.search?.trim();
  if (term) {
    const { data: matchingOrders } = await supabase
      .from("orders")
      .select("id")
      .or(`order_number.ilike.%${term}%,guest_name.ilike.%${term}%,guest_phone.ilike.%${term}%`);
    const orderIds = (matchingOrders ?? []).map((o) => o.id);
    if (orderIds.length === 0) {
      return { payments: [], total: 0, page, pageCount: 1 };
    }
    query = query.in("order_id", orderIds);
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  return {
    payments: (data ?? []) as unknown as AdminPaymentListItem[],
    total: count ?? 0,
    page,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
  };
}

export async function getPaymentByOrderId(orderId: string): Promise<AdminPaymentRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();
  return data ?? null;
}
