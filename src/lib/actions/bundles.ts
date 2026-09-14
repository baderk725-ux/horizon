"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { bundleSchema } from "@/lib/validation/bundles";

export type BundleActionState = { error: string | null };

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

function readForm(formData: FormData) {
  let products: unknown = [];
  try {
    products = JSON.parse(String(formData.get("productsJson") ?? "[]"));
  } catch {
    products = [];
  }
  return bundleSchema.safeParse({
    nameEn: formData.get("nameEn"),
    nameAr: formData.get("nameAr"),
    descriptionEn: formData.get("descriptionEn") ?? "",
    descriptionAr: formData.get("descriptionAr") ?? "",
    bundlePrice: formData.get("bundlePrice"),
    isActive: formData.get("isActive") === "on",
    products,
  });
}

export async function createBundleAction(
  _prev: BundleActionState,
  formData: FormData,
): Promise<BundleActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readForm(formData);
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { data: bundle, error } = await supabase
    .from("bundles")
    .insert({
      name_en: parsed.data.nameEn,
      name_ar: parsed.data.nameAr,
      description_en: parsed.data.descriptionEn ?? null,
      description_ar: parsed.data.descriptionAr ?? null,
      bundle_price: parsed.data.bundlePrice,
      is_active: parsed.data.isActive,
    })
    .select("id")
    .single();

  if (error || !bundle) return { error: "save_failed" };

  const { error: itemsError } = await supabase.from("bundle_products").insert(
    parsed.data.products.map((p) => ({
      bundle_id: bundle.id,
      product_id: p.productId,
      quantity: p.quantity,
    })),
  );
  if (itemsError) {
    await supabase.from("bundles").delete().eq("id", bundle.id);
    return { error: "save_failed" };
  }

  revalidatePath("/admin/bundles");
  return { error: null };
}

export async function updateBundleAction(
  id: string,
  _prev: BundleActionState,
  formData: FormData,
): Promise<BundleActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readForm(formData);
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("bundles")
    .update({
      name_en: parsed.data.nameEn,
      name_ar: parsed.data.nameAr,
      description_en: parsed.data.descriptionEn ?? null,
      description_ar: parsed.data.descriptionAr ?? null,
      bundle_price: parsed.data.bundlePrice,
      is_active: parsed.data.isActive,
    })
    .eq("id", id);
  if (error) return { error: "save_failed" };

  // bundle_products has no updated-in-place semantics worth building —
  // this is staff-authored catalog data, not a financial ledger, so a
  // clean replace (delete then re-insert the submitted recipe) is simpler
  // and just as correct as a diff. Past orders are unaffected: order_items
  // already copied product_name/unit_price/quantity at purchase time and
  // only carries bundle_id as an ON DELETE SET NULL reference.
  const { error: deleteError } = await supabase.from("bundle_products").delete().eq("bundle_id", id);
  if (deleteError) return { error: "save_failed" };

  const { error: insertError } = await supabase.from("bundle_products").insert(
    parsed.data.products.map((p) => ({
      bundle_id: id,
      product_id: p.productId,
      quantity: p.quantity,
    })),
  );
  if (insertError) return { error: "save_failed" };

  revalidatePath("/admin/bundles");
  revalidatePath(`/admin/bundles/${id}`);
  return { error: null };
}

export async function setBundleActiveAction(
  id: string,
  isActive: boolean,
): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { error } = await supabase.from("bundles").update({ is_active: isActive }).eq("id", id);
  if (error) return { error: "save_failed" };

  revalidatePath("/admin/bundles");
  return { error: null };
}

/** Only offered/attempted for a bundle with zero order history — deleting
 * one that real orders reference would silently null out those orders'
 * bundle_id (ON DELETE SET NULL) rather than actually blocking, so this
 * checks first instead of relying on the FK to protect the data. */
export async function deleteBundleAction(id: string): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { count } = await supabase
    .from("order_items")
    .select("id", { count: "exact", head: true })
    .eq("bundle_id", id);
  if ((count ?? 0) > 0) return { error: "bundle_in_use" };

  const { error } = await supabase.from("bundles").delete().eq("id", id);
  if (error) return { error: "delete_failed" };

  revalidatePath("/admin/bundles");
  return { error: null };
}
