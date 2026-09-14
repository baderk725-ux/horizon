"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isSuperAdmin } from "@/lib/data/auth";
import { countSuperAdmins } from "@/lib/data/admin/staff";
import { staffRoleSchema } from "@/lib/validation/staff";

export type StaffActionState = { error: string | null };

/**
 * Only super_admin may reach any of these — matches admin_has('admin_users')
 * exactly (true only for super_admin, hard-denied for every other role) and
 * restrict_profile_update_columns() (BEFORE UPDATE, DB-enforced regardless
 * of this check) which independently rejects a staff_role or role='admin'
 * change from anyone who isn't admin_has('admin_users').
 */
async function requireSuperAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isSuperAdmin(current.profile)) return "not_authorized";
  return null;
}

export async function promoteToStaffAction(
  profileId: string,
  _prev: StaffActionState,
  formData: FormData,
): Promise<StaffActionState> {
  const authError = await requireSuperAdmin();
  if (authError) return { error: authError };

  const parsed = staffRoleSchema.safeParse({ staffRole: formData.get("staffRole") });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: "admin", staff_role: parsed.data.staffRole })
    .eq("id", profileId)
    .eq("role", "customer");

  if (error) return { error: "save_failed" };

  revalidatePath("/admin/staff");
  return { error: null };
}

/**
 * Never allows removing super_admin status from the last remaining
 * super_admin — that would leave nobody able to manage staff at all
 * (admin_has('admin_users') would become permanently false for every
 * account). This is checked here in the app layer since the DB has no
 * equivalent guard; it's the one destructive-lockout case worth a
 * dedicated safety check rather than relying on "don't do that."
 */
async function wouldRemoveLastSuperAdmin(profileId: string, currentStaffRole: string, nextIsSuperAdmin: boolean): Promise<boolean> {
  if (currentStaffRole !== "super_admin" || nextIsSuperAdmin) return false;
  const remaining = await countSuperAdmins();
  return remaining <= 1;
}

export async function updateStaffRoleAction(
  profileId: string,
  currentStaffRole: string,
  _prev: StaffActionState,
  formData: FormData,
): Promise<StaffActionState> {
  const authError = await requireSuperAdmin();
  if (authError) return { error: authError };

  const parsed = staffRoleSchema.safeParse({ staffRole: formData.get("staffRole") });
  if (!parsed.success) return { error: "invalid_input" };

  if (await wouldRemoveLastSuperAdmin(profileId, currentStaffRole, parsed.data.staffRole === "super_admin")) {
    return { error: "last_super_admin" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ staff_role: parsed.data.staffRole })
    .eq("id", profileId)
    .eq("role", "admin");

  if (error) return { error: "save_failed" };

  revalidatePath("/admin/staff");
  return { error: null };
}

export async function demoteStaffAction(
  profileId: string,
  currentStaffRole: string,
): Promise<StaffActionState> {
  const authError = await requireSuperAdmin();
  if (authError) return { error: authError };

  if (await wouldRemoveLastSuperAdmin(profileId, currentStaffRole, false)) {
    return { error: "last_super_admin" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: "customer" })
    .eq("id", profileId)
    .eq("role", "admin");

  if (error) return { error: "save_failed" };

  revalidatePath("/admin/staff");
  return { error: null };
}
