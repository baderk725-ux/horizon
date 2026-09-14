"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { collectionSchema } from "@/lib/validation/collections";

export type CollectionActionState = { error: string | null };

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

function readForm(formData: FormData) {
  let productIds: unknown = [];
  try {
    productIds = JSON.parse(String(formData.get("productIdsJson") ?? "[]"));
  } catch {
    productIds = [];
  }
  return collectionSchema.safeParse({
    nameEn: formData.get("nameEn"),
    nameAr: formData.get("nameAr"),
    slug: formData.get("slug"),
    placement: formData.get("placement"),
    cardSize: formData.get("cardSize"),
    sortOrder: formData.get("sortOrder") ?? "0",
    isActive: formData.get("isActive") === "on",
    productIds,
  });
}

async function replaceMembers(
  supabase: Awaited<ReturnType<typeof createClient>>,
  collectionId: string,
  productIds: string[],
) {
  const { error: deleteError } = await supabase
    .from("collection_products")
    .delete()
    .eq("collection_id", collectionId);
  if (deleteError) return deleteError;

  if (productIds.length === 0) return null;
  const { error: insertError } = await supabase.from("collection_products").insert(
    productIds.map((productId, index) => ({
      collection_id: collectionId,
      product_id: productId,
      sort_order: index,
    })),
  );
  return insertError;
}

export async function createCollectionAction(
  _prev: CollectionActionState,
  formData: FormData,
): Promise<CollectionActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readForm(formData);
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { data: collection, error } = await supabase
    .from("collections")
    .insert({
      name_en: parsed.data.nameEn,
      name_ar: parsed.data.nameAr,
      slug: parsed.data.slug,
      placement: parsed.data.placement,
      card_size: parsed.data.cardSize,
      sort_order: parsed.data.sortOrder,
      is_active: parsed.data.isActive,
    })
    .select("id")
    .single();

  if (error || !collection) {
    return { error: error?.code === "23505" ? "duplicate_slug" : "save_failed" };
  }

  const membersError = await replaceMembers(supabase, collection.id, parsed.data.productIds);
  if (membersError) {
    await supabase.from("collections").delete().eq("id", collection.id);
    return { error: "save_failed" };
  }

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  revalidatePath("/");
  return { error: null };
}

export async function updateCollectionAction(
  id: string,
  _prev: CollectionActionState,
  formData: FormData,
): Promise<CollectionActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = readForm(formData);
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("collections")
    .update({
      name_en: parsed.data.nameEn,
      name_ar: parsed.data.nameAr,
      slug: parsed.data.slug,
      placement: parsed.data.placement,
      card_size: parsed.data.cardSize,
      sort_order: parsed.data.sortOrder,
      is_active: parsed.data.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: error.code === "23505" ? "duplicate_slug" : "save_failed" };

  const membersError = await replaceMembers(supabase, id, parsed.data.productIds);
  if (membersError) return { error: "save_failed" };

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  revalidatePath(`/collection/${parsed.data.slug}`);
  revalidatePath("/");
  return { error: null };
}

export async function setCollectionActiveAction(
  id: string,
  isActive: boolean,
): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { error } = await supabase.from("collections").update({ is_active: isActive }).eq("id", id);
  if (error) return { error: "save_failed" };

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  revalidatePath("/");
  return { error: null };
}

export async function deleteCollectionAction(id: string): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) return { error: "save_failed" };

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  revalidatePath("/");
  return { error: null };
}
