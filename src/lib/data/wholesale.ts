import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type WholesaleApplicationRow = Database["public"]["Tables"]["wholesale_applications"]["Row"];

/** wapp_select_own_or_staff RLS (user_id = auth.uid() OR admin_has
 * ('wholesale')) is what actually scopes this to the caller's own rows. */
export async function getMyWholesaleApplication(userId: string): Promise<WholesaleApplicationRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("wholesale_applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ?? null;
}
