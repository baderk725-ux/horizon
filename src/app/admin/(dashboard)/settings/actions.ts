"use server";

import { revalidatePath } from "next/cache";
import { updateSiteSettings } from "@/lib/settings";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

export interface SettingsFormState {
  error?: string;
  saved?: boolean;
}

export async function updateSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const settings: SiteSettings = {
    siteName: String(formData.get("siteName") ?? ""),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    contactPhone: String(formData.get("contactPhone") ?? ""),
    address: String(formData.get("address") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? ""),
    facebookUrl: String(formData.get("facebookUrl") ?? ""),
    tiktokUrl: String(formData.get("tiktokUrl") ?? ""),
  };

  try {
    await updateSiteSettings(settings);
  } catch {
    return { error: "Could not save settings." };
  }

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
  return { saved: true };
}

export async function changePasswordAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  return { saved: true };
}
