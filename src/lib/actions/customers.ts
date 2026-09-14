"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { manualCustomerSchema } from "@/lib/validation/customers";

export type CustomerActionState = { error: string | null };

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

/**
 * manual_customers is staff-owned data (captured during manual order
 * entry, not a user account) — safe for staff to edit directly. A
 * registered customer's profiles row is never editable from here: it's
 * the customer's own account, protected by profiles_update_own, and
 * admin-side identity mutation isn't something this subsystem offers.
 */
export async function updateManualCustomerAction(
  id: string,
  _prev: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = manualCustomerSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    address: formData.get("address") ?? "",
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("manual_customers")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email ?? null,
      address: parsed.data.address ?? null,
      notes: parsed.data.notes ?? null,
    })
    .eq("id", id);

  if (error) return { error: "save_failed" };

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${id}`);
  return { error: null };
}
