import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type StoreSettings = Database["public"]["Tables"]["store_settings"]["Row"];

/** Publicly readable singleton row (store_settings_public_read RLS) — safe
 * to call from the storefront for anon and signed-in customers alike. */
export async function getStoreSettings(): Promise<StoreSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("store_settings").select("*").eq("id", true).maybeSingle();
  return data ?? null;
}
