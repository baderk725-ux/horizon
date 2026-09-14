"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { expenseSchema } from "@/lib/validation/expenses";

export type ExpenseActionState = { error: string | null };

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

function readForm(formData: FormData) {
  return expenseSchema.safeParse({
    category: formData.get("category"),
    description: formData.get("description") ?? "",
    amount: formData.get("amount"),
    expenseDate: formData.get("expenseDate"),
  });
}

export async function createExpenseAction(
  _prev: ExpenseActionState,
  formData: FormData,
): Promise<ExpenseActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readForm(formData);
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase.from("expenses").insert({
    category: parsed.data.category,
    description: parsed.data.description ?? null,
    amount: parsed.data.amount,
    expense_date: parsed.data.expenseDate,
  });
  if (error) return { error: "save_failed" };

  revalidatePath("/admin/finance");
  return { error: null };
}

export async function deleteExpenseAction(id: string): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return { error: "delete_failed" };

  revalidatePath("/admin/finance");
  return { error: null };
}
