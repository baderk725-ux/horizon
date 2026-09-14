import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type StaffProfile = Database["public"]["Tables"]["profiles"]["Row"];
export type StaffRole = Database["public"]["Enums"]["staff_role"];

export async function getAdminStaff(): Promise<StaffProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "admin")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Candidates for promotion: existing customer accounts only — staff
 * accounts are never created from scratch here, only promoted from a real
 * signed-up customer (there's no separate invite/create-admin flow). */
export async function searchPromotableCustomers(term: string): Promise<StaffProfile[]> {
  if (!term.trim()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .or(`full_name.ilike.%${term.trim()}%,email.ilike.%${term.trim()}%`)
    .limit(10);
  if (error) throw error;
  return data ?? [];
}

export async function countSuperAdmins(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin")
    .eq("staff_role", "super_admin");
  if (error) throw error;
  return count ?? 0;
}
