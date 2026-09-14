"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { wholesaleApplicationSchema } from "@/lib/validation/wholesale";
import { chargeSchema, paymentSchema } from "@/lib/validation/wholesale-ledger";

export type WholesaleActionState = { error: string | null };

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

/**
 * One application per customer at a time: a customer with an existing
 * pending/approved application is blocked at the app layer here (the DB
 * has no equivalent uniqueness constraint — wholesale_applications allows
 * multiple rows per user_id by design, e.g. a fresh application after a
 * prior rejection). The uploaded file goes to the already-existing
 * private 'commercial-documents' bucket; its RLS (cr_docs_upload) already
 * requires owner = auth.uid(), so this can only ever upload as the
 * caller themselves.
 */
export async function submitWholesaleApplicationAction(
  _prev: WholesaleActionState,
  formData: FormData,
): Promise<WholesaleActionState> {
  const current = await getCurrentUser();
  if (!current) return { error: "not_authorized" };

  const parsed = wholesaleApplicationSchema.safeParse({
    fullName: formData.get("fullName"),
    companyName: formData.get("companyName"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    governorateId: formData.get("governorateId") ?? "",
    areaText: formData.get("areaText") ?? "",
    address: formData.get("address"),
    commercialRegistrationNumber: formData.get("commercialRegistrationNumber"),
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return { error: "invalid_input" };

  const file = formData.get("commercialDocument");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "document_required" };
  }
  if (file.size > MAX_FILE_BYTES) return { error: "file_too_large" };
  if (!ALLOWED_TYPES.includes(file.type)) return { error: "invalid_file_type" };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("wholesale_applications")
    .select("id")
    .eq("user_id", current.userId)
    .in("status", ["pending", "approved"])
    .maybeSingle();
  if (existing) return { error: "application_already_open" };

  const extension = file.type.split("/")[1];
  const path = `${current.userId}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("commercial-documents")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) return { error: "upload_failed" };

  const { error } = await supabase.from("wholesale_applications").insert({
    user_id: current.userId,
    full_name: parsed.data.fullName,
    company_name: parsed.data.companyName,
    phone: parsed.data.phone,
    email: parsed.data.email ?? current.email,
    governorate_id: parsed.data.governorateId ?? null,
    area_text: parsed.data.areaText ?? null,
    address: parsed.data.address,
    commercial_registration_number: parsed.data.commercialRegistrationNumber,
    commercial_document_path: path,
    notes: parsed.data.notes ?? null,
  });

  if (error) {
    await supabase.storage.from("commercial-documents").remove([path]);
    return { error: "save_failed" };
  }

  revalidatePath("/account/wholesale");
  return { error: null };
}

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

/**
 * Deliberately narrow: only ever sets `status`, stale-checked like every
 * other status-transition action in this app. reviewed_by/reviewed_at are
 * server-stamped by stamp_wholesale_review() — never client-suppliable —
 * and approval/rejection's actual effect on the applicant's account is
 * applied atomically by sync_profile_on_wholesale_decision(), not by this
 * action directly touching profiles.
 */
export async function updateWholesaleApplicationStatusAction(
  applicationId: string,
  currentStatus: string,
  nextStatus: "approved" | "rejected",
): Promise<WholesaleActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  if (currentStatus !== "pending") return { error: "invalid_transition" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wholesale_applications")
    .update({ status: nextStatus })
    .eq("id", applicationId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.message?.includes("Invalid wholesale application status transition")) {
      return { error: "invalid_transition" };
    }
    return { error: "update_failed" };
  }
  if (!data) return { error: "stale_or_unauthorized" };

  revalidatePath("/admin/wholesale");
  revalidatePath(`/admin/wholesale/${applicationId}`);
  return { error: null };
}

/** RLS (wholesale_charges_staff_all, admin_has('wholesale')) is the real
 * authority; this is a plain insert with server-validated fields, no
 * client-suppliable status (defaults to 'pending', only ever flipped to
 * 'paid' by check_charge_paid() once payments cover it). */
export async function recordWholesaleChargeAction(
  customerId: string,
  _prev: WholesaleActionState,
  formData: FormData,
): Promise<WholesaleActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = chargeSchema.safeParse({
    description: formData.get("description") ?? "",
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate"),
  });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase.from("wholesale_charges").insert({
    customer_id: customerId,
    description: parsed.data.description ?? null,
    amount: parsed.data.amount,
    due_date: parsed.data.dueDate,
  });
  if (error) return { error: "save_failed" };

  revalidatePath(`/admin/wholesale/customers/${customerId}`);
  revalidatePath("/admin/customers");
  return { error: null };
}

/** recorded_by is server-stamped from the current admin, never client-
 * supplied. check_charge_paid() (AFTER INSERT, pre-existing) reconciles
 * the linked charge to 'paid' once payments cover its amount. */
export async function recordWholesalePaymentAction(
  customerId: string,
  _prev: WholesaleActionState,
  formData: FormData,
): Promise<WholesaleActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const current = await getCurrentUser();
  const parsed = paymentSchema.safeParse({
    chargeId: formData.get("chargeId") ?? "",
    amount: formData.get("amount"),
    method: formData.get("method") ?? "",
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase.from("wholesale_payments").insert({
    customer_id: customerId,
    charge_id: parsed.data.chargeId ?? null,
    amount: parsed.data.amount,
    method: parsed.data.method ?? null,
    notes: parsed.data.notes ?? null,
    recorded_by: current?.userId ?? null,
  });
  if (error) return { error: "save_failed" };

  revalidatePath(`/admin/wholesale/customers/${customerId}`);
  return { error: null };
}
