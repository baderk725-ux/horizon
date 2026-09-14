import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type SupplierRow = Database["public"]["Tables"]["suppliers"]["Row"];

export async function getAdminSuppliers(): Promise<SupplierRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("suppliers").select("*").order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
