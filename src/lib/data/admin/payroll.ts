import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type StaffSalaryRow = Database["public"]["Tables"]["staff_salaries"]["Row"];
export type PayrollPaymentRow = Database["public"]["Tables"]["payroll_payments"]["Row"];

export type StaffPayrollListItem = {
  profileId: string;
  fullName: string | null;
  email: string | null;
  staffRole: string;
  monthlySalary: number | null;
};

/** Lists every staff account (role='admin') with their current salary
 * record, if one has been set — left-joined, since a salary row isn't
 * created automatically when someone is promoted to staff. */
export async function getAdminStaffPayroll(): Promise<StaffPayrollListItem[]> {
  const supabase = await createClient();
  const { data: staff, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, staff_role")
    .eq("role", "admin")
    .order("full_name", { ascending: true });
  if (error) throw error;

  const { data: salaries } = await supabase.from("staff_salaries").select("profile_id, monthly_salary");
  const salaryByProfile = new Map((salaries ?? []).map((s) => [s.profile_id, s.monthly_salary]));

  return (staff ?? []).map((s) => ({
    profileId: s.id,
    fullName: s.full_name,
    email: s.email,
    staffRole: s.staff_role,
    monthlySalary: salaryByProfile.get(s.id) ?? null,
  }));
}

export async function getStaffPaymentHistory(profileId: string): Promise<PayrollPaymentRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payroll_payments")
    .select("*")
    .eq("profile_id", profileId)
    .order("payment_date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
