import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type ExpenseRow = Database["public"]["Tables"]["expenses"]["Row"];

export async function getAdminExpenses(params: { from?: string; to?: string }): Promise<ExpenseRow[]> {
  const supabase = await createClient();
  let query = supabase.from("expenses").select("*").order("expense_date", { ascending: false });
  if (params.from) query = query.gte("expense_date", params.from);
  if (params.to) query = query.lte("expense_date", params.to);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export type FinanceSummary = {
  revenue: number;
  orderCount: number;
  expenses: number;
  net: number;
  expensesByCategory: { category: string; amount: number }[];
};

/**
 * Revenue is the sum of real order totals (status <> 'cancelled' — a
 * cancelled order was never fulfilled and never really "revenue").
 * Deliberately does NOT compute cost of goods sold: order_items.unit_cost
 * is never actually populated by create_order() (verified — it only ever
 * sets unit_price), so any COGS figure here would be fabricated data
 * dressed up as real accounting. "net" is revenue minus recorded expenses
 * only, not a full profit figure — the UI labels it accordingly rather
 * than implying more than what's actually tracked.
 */
export async function getFinanceSummary(params: { from: string; to: string }): Promise<FinanceSummary> {
  const supabase = await createClient();

  const [{ data: orders }, { data: expenses }] = await Promise.all([
    supabase
      .from("orders")
      .select("total")
      .neq("status", "cancelled")
      .gte("created_at", params.from)
      .lte("created_at", `${params.to}T23:59:59`),
    supabase
      .from("expenses")
      .select("category, amount")
      .gte("expense_date", params.from)
      .lte("expense_date", params.to),
  ]);

  const revenue = (orders ?? []).reduce((sum, o) => sum + o.total, 0);
  const expenseRows = expenses ?? [];
  const totalExpenses = expenseRows.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = new Map<string, number>();
  for (const e of expenseRows) {
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
  }

  return {
    revenue,
    orderCount: (orders ?? []).length,
    expenses: totalExpenses,
    net: revenue - totalExpenses,
    expensesByCategory: Array.from(byCategory.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount),
  };
}
