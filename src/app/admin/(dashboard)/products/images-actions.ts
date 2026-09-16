"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addProductImageRecord(productId: string, url: string, alt: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    url,
    alt,
    sort_order: count ?? 0,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
}

export async function deleteProductImageAction(productId: string, imageId: string, storagePath?: string) {
  const supabase = await createClient();
  await supabase.from("product_images").delete().eq("id", imageId);
  if (storagePath) {
    await supabase.storage.from("product-images").remove([storagePath]);
  }
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
}
