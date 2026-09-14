import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type AdminCouponRow = Database["public"]["Tables"]["coupons"]["Row"];

export async function getAdminCoupons(): Promise<AdminCouponRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAdminCouponById(id: string): Promise<AdminCouponRow | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("coupons").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}
