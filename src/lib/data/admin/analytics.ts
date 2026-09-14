import { createClient } from "@/lib/supabase/server";

export type OrderStatusBreakdown = { status: string; count: number };

/** Every order's current status (all-time snapshot, not date-ranged —
 * a status distribution is inherently a current-state view). */
export async function getOrderStatusBreakdown(): Promise<OrderStatusBreakdown[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select("status");
  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([status, count]) => ({ status, count }));
}

export type DailyRevenuePoint = { date: string; revenue: number };

/** Revenue excludes cancelled orders, same convention used in Reports/
 * Finance. Always returns one point per day in the range (zero-filled),
 * so a chart never has to guess at missing days. */
export async function getRevenueTrend(days: number): Promise<DailyRevenuePoint[]> {
  const supabase = await createClient();
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - (days - 1));
  const fromStr = from.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total")
    .neq("status", "cancelled")
    .gte("created_at", fromStr);
  if (error) throw error;

  const byDay = new Map<string, number>();
  for (const order of data ?? []) {
    const day = order.created_at.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + order.total);
  }

  const points: DailyRevenuePoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    points.push({ date: key, revenue: byDay.get(key) ?? 0 });
  }
  return points;
}
