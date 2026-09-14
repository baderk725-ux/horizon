import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Current auth user + their profile row, or null if signed out.
 * `auth.getUser()` (not `getSession()`) re-validates against Supabase Auth
 * on every call, which is required before trusting the result server-side.
 */
export async function getCurrentUser(): Promise<{
  userId: string;
  email: string | null;
  profile: Profile | null;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { userId: user.id, email: user.email ?? null, profile: profile ?? null };
}

export function isAdmin(profile: Profile | null): boolean {
  return profile?.role === "admin";
}
