"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { salarySchema, payrollPaymentSchema } from "@/lib/validation/payroll";

export type PayrollActionState = { error: string | null };

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

/** Upsert: one row per staff member (staff_salaries.profile_id is the
 * primary key), so setting a salary either creates or updates it. */
export async function setStaffSalaryAction(
  profileId: string,
  _prev: PayrollActionState,
  formData: FormData,
): Promise<PayrollActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = salarySchema.safeParse({
    monthlySalary: formData.get("monthlySalary"),
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase.from("staff_salaries").upsert({
    profile_id: profileId,
    monthly_salary: parsed.data.monthlySalary,
    notes: parsed.data.notes ?? null,
  });
  if (error) return { error: "save_failed" };

  revalidatePath("/admin/payroll");
  return { error: null };
}

/** recorded_by is server-set from the current admin, never client-
 * supplied. */
export async function recordPayrollPaymentAction(
  profileId: string,
  _prev: PayrollActionState,
  formData: FormData,
): Promise<PayrollActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const current = await getCurrentUser();
  const parsed = payrollPaymentSchema.safeParse({
    amount: formData.get("amount"),
    period: formData.get("period"),
    paymentDate: formData.get("paymentDate"),
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase.from("payroll_payments").insert({
    profile_id: profileId,
    amount: parsed.data.amount,
    period: parsed.data.period,
    payment_date: parsed.data.paymentDate,
    notes: parsed.data.notes ?? null,
    recorded_by: current?.userId ?? null,
  });
  if (error) return { error: "save_failed" };

  revalidatePath(`/admin/payroll/${profileId}`);
  return { error: null };
}
