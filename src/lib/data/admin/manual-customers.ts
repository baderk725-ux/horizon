import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type ManualCustomerRow = Database["public"]["Tables"]["manual_customers"]["Row"];

export async function getManualCustomers(): Promise<ManualCustomerRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("manual_customers")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
