"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export type ProductImageActionState = { error: string | null };

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

export async function uploadProductImageAction(
  productId: string,
  _prev: ProductImageActionState,
  formData: FormData,
): Promise<ProductImageActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "no_file" };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { error: "file_too_large" };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "invalid_file_type" };
  }

  const supabase = await createClient();
  const extension = file.type.split("/")[1];
  const path = `${productId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("product-media")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { error: "upload_failed" };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-media").getPublicUrl(path);

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  const { error: insertError } = await supabase.from("product_images").insert({
    product_id: productId,
    url: publicUrl,
    sort_order: count ?? 0,
  });

  if (insertError) {
    // Roll back the uploaded file so it doesn't become an orphaned object.
    await supabase.storage.from("product-media").remove([path]);
    return { error: "save_failed" };
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/[locale]", "page");
  return { error: null };
}

export async function deleteProductImageAction(
  imageId: string,
  productId: string,
): Promise<{ error: string | null }> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();

  const { data: image } = await supabase
    .from("product_images")
    .select("url")
    .eq("id", imageId)
    .maybeSingle();

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (error) return { error: "delete_failed" };

  if (image?.url) {
    const marker = "/product-media/";
    const idx = image.url.indexOf(marker);
    if (idx !== -1) {
      const path = image.url.slice(idx + marker.length);
      await supabase.storage.from("product-media").remove([path]);
    }
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/[locale]", "page");
  return { error: null };
}
