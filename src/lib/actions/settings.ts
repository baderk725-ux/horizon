"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { storeSettingsSchema } from "@/lib/validation/settings";

export type SettingsActionState = { error: string | null };

/** Coarse app-layer check (matches every other admin action file's
 * pattern); RLS (admin_has('settings'), manager/super_admin only) is the
 * real, finer-grained authority regardless of what this returns. */
async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

export async function updateStoreSettingsAction(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = storeSettingsSchema.safeParse({
    supportEmail: formData.get("supportEmail") ?? "",
    supportPhone: formData.get("supportPhone") ?? "",
    whatsappNumber: formData.get("whatsappNumber") ?? "",
    instagramUrl: formData.get("instagramUrl") ?? "",
    facebookUrl: formData.get("facebookUrl") ?? "",
    tiktokUrl: formData.get("tiktokUrl") ?? "",
  });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("store_settings")
    .update({
      support_email: parsed.data.supportEmail ?? null,
      support_phone: parsed.data.supportPhone ?? null,
      whatsapp_number: parsed.data.whatsappNumber ?? null,
      instagram_url: parsed.data.instagramUrl ?? null,
      facebook_url: parsed.data.facebookUrl ?? null,
      tiktok_url: parsed.data.tiktokUrl ?? null,
    })
    .eq("id", true);

  if (error) {
    return { error: error.message?.includes("not_authorized") || error.code === "42501" ? "not_authorized" : "save_failed" };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { error: null };
}
