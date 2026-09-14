import { createClient } from "@/lib/supabase/server";

export type SalesByDay = { date: string; orderCount: number; revenue: number };

/** Revenue excludes cancelled orders (never fulfilled) — same convention
 * as the Finance summary. Grouped by day in application code since this
 * is a small dataset read, not worth a dedicated SQL view. */
export async function getSalesByDay(params: { from: string; to: string }): Promise<SalesByDay[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total, status")
    .neq("status", "cancelled")
    .gte("created_at", params.from)
    .lte("created_at", `${params.to}T23:59:59`)
    .order("created_at", { ascending: true });
  if (error) throw error;

  const byDay = new Map<string, { orderCount: number; revenue: number }>();
  for (const order of data ?? []) {
    const day = order.created_at.slice(0, 10);
    const entry = byDay.get(day) ?? { orderCount: 0, revenue: 0 };
    entry.orderCount += 1;
    entry.revenue += order.total;
    byDay.set(day, entry);
  }

  return Array.from(byDay.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export type TopProduct = {
  productId: string | null;
  nameEn: string;
  nameAr: string;
  unitsSold: number;
  revenue: number;
};

/** Reads order_items joined through orders to exclude cancelled ones —
 * order_items itself has no status, only the parent order does. */
export async function getTopProducts(params: { from: string; to: string; limit?: number }): Promise<TopProduct[]> {
  const supabase = await createClient();

  // Resolve eligible order ids first (excluding cancelled), then pull
  // their items — simpler and more predictable than filtering on an
  // embedded relation's columns through PostgREST's dot-path syntax.
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id")
    .neq("status", "cancelled")
    .gte("created_at", params.from)
    .lte("created_at", `${params.to}T23:59:59`);
  if (ordersError) throw ordersError;

  const orderIds = (orders ?? []).map((o) => o.id);
  if (orderIds.length === 0) return [];

  const { data, error } = await supabase
    .from("order_items")
    .select("product_id, product_name_en, product_name_ar, quantity, unit_price")
    .in("order_id", orderIds);
  if (error) throw error;

  const byProduct = new Map<string, TopProduct>();
  for (const item of data ?? []) {
    const key = item.product_id ?? item.product_name_en;
    const existing = byProduct.get(key);
    const revenue = item.unit_price * item.quantity;
    if (existing) {
      existing.unitsSold += item.quantity;
      existing.revenue += revenue;
    } else {
      byProduct.set(key, {
        productId: item.product_id,
        nameEn: item.product_name_en,
        nameAr: item.product_name_ar,
        unitsSold: item.quantity,
        revenue,
      });
    }
  }

  return Array.from(byProduct.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, params.limit ?? 10);
}

export type ReportsOverview = {
  newCustomers: number;
  returnsCount: number;
  expensesTotal: number;
  lowStockCount: number;
  outOfStockCount: number;
};

/**
 * Supplementary metrics alongside sales/top-products — all read directly
 * from real tables, nothing derived or estimated. Stock counts are not
 * date-ranged (stock is a current snapshot, not a historical figure);
 * everything else respects the given range.
 */
export async function getReportsOverview(params: { from: string; to: string }): Promise<ReportsOverview> {
  const supabase = await createClient();

  const [{ count: newCustomers }, { count: returnsCount }, { data: expenses }, { data: products }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .in("role", ["customer", "wholesale_customer"])
        .gte("created_at", params.from)
        .lte("created_at", `${params.to}T23:59:59`),
      supabase
        .from("returns")
        .select("id", { count: "exact", head: true })
        .gte("created_at", params.from)
        .lte("created_at", `${params.to}T23:59:59`),
      supabase.from("expenses").select("amount").gte("expense_date", params.from).lte("expense_date", params.to),
      supabase.from("products").select("stock_quantity, low_stock_threshold"),
    ]);

  const expensesTotal = (expenses ?? []).reduce((sum, e) => sum + e.amount, 0);
  const lowStockCount = (products ?? []).filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold,
  ).length;
  const outOfStockCount = (products ?? []).filter((p) => p.stock_quantity === 0).length;

  return {
    newCustomers: newCustomers ?? 0,
    returnsCount: returnsCount ?? 0,
    expensesTotal,
    lowStockCount,
    outOfStockCount,
  };
}
