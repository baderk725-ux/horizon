"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { supplierSchema } from "@/lib/validation/suppliers";

export type SupplierActionState = { error: string | null };

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

function readForm(formData: FormData) {
  return supplierSchema.safeParse({
    name: formData.get("name"),
    contactPerson: formData.get("contactPerson") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    address: formData.get("address") ?? "",
    notes: formData.get("notes") ?? "",
  });
}

export async function createSupplierAction(
  _prev: SupplierActionState,
  formData: FormData,
): Promise<SupplierActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readForm(formData);
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase.from("suppliers").insert({
    name: parsed.data.name,
    contact_person: parsed.data.contactPerson ?? null,
    phone: parsed.data.phone ?? null,
    email: parsed.data.email ?? null,
    address: parsed.data.address ?? null,
    notes: parsed.data.notes ?? null,
  });
  if (error) return { error: "save_failed" };

  revalidatePath("/admin/suppliers");
  return { error: null };
}

export async function updateSupplierAction(
  id: string,
  _prev: SupplierActionState,
  formData: FormData,
): Promise<SupplierActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readForm(formData);
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("suppliers")
    .update({
      name: parsed.data.name,
      contact_person: parsed.data.contactPerson ?? null,
      phone: parsed.data.phone ?? null,
      email: parsed.data.email ?? null,
      address: parsed.data.address ?? null,
      notes: parsed.data.notes ?? null,
    })
    .eq("id", id);
  if (error) return { error: "save_failed" };

  revalidatePath("/admin/suppliers");
  return { error: null };
}

/** Blocked (ahead of the DB) for any supplier with purchase order history
 * — purchase_orders_supplier_id_fkey is ON DELETE SET NULL, which would
 * silently orphan those records' supplier reference rather than actually
 * protecting anything, so this checks first. */
export async function deleteSupplierAction(id: string): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { count } = await supabase
    .from("purchase_orders")
    .select("id", { count: "exact", head: true })
    .eq("supplier_id", id);
  if ((count ?? 0) > 0) return { error: "supplier_in_use" };

  const { error } = await supabase.from("suppliers").delete().eq("id", id);
  if (error) return { error: "delete_failed" };

  revalidatePath("/admin/suppliers");
  return { error: null };
}
