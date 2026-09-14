import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type AdminWholesaleApplicationRow = Database["public"]["Tables"]["wholesale_applications"]["Row"];
export type WholesaleChargeRow = Database["public"]["Tables"]["wholesale_charges"]["Row"];
export type WholesalePaymentRow = Database["public"]["Tables"]["wholesale_payments"]["Row"];
export type WholesaleApplicationStatus = Database["public"]["Enums"]["wholesale_status"];

export async function getAdminWholesaleApplications(params: {
  status?: WholesaleApplicationStatus;
}): Promise<AdminWholesaleApplicationRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("wholesale_applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (params.status) query = query.eq("status", params.status);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getAdminWholesaleApplicationById(
  id: string,
): Promise<AdminWholesaleApplicationRow | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("wholesale_applications").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}

export async function getWholesaleDocumentUrl(path: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.storage.from("commercial-documents").createSignedUrl(path, 300);
  return data?.signedUrl ?? null;
}

export async function getWholesaleCustomerLedger(customerId: string): Promise<{
  charges: WholesaleChargeRow[];
  payments: WholesalePaymentRow[];
}> {
  const supabase = await createClient();
  const [{ data: charges }, { data: payments }] = await Promise.all([
    supabase
      .from("wholesale_charges")
      .select("*")
      .eq("customer_id", customerId)
      .order("due_date", { ascending: false }),
    supabase
      .from("wholesale_payments")
      .select("*")
      .eq("customer_id", customerId)
      .order("payment_date", { ascending: false }),
  ]);
  return { charges: charges ?? [], payments: payments ?? [] };
}
