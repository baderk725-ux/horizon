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

/** super_admin is the only staff_role admin_has() grants every area to
 * (including 'admin_users', which every other role is hard-denied) — the
 * one role allowed to manage staff accounts at all. */
export function isSuperAdmin(profile: Profile | null): boolean {
  return profile?.role === "admin" && profile?.staff_role === "super_admin";
}
