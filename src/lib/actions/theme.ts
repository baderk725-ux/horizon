"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { themeSettingsSchema } from "@/lib/validation/theme";
import { buildBrandScale, contrastRatio } from "@/lib/theme/palette";

export type ThemeActionState = { error: string | null };

const PAPER = "#faf8f5";
const MIN_TEXT_CONTRAST = 4.5;

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

/**
 * Only two colors are ever stored — the full brand-50..950 scale is derived
 * deterministically at render time (see lib/theme/palette.ts) so an admin
 * can never accidentally pick a set of shades that breaks text contrast.
 * As a defensive second check (not just belt-and-braces styling — this is
 * the WCAG 2.1 AA text-contrast floor from this project's accessibility
 * standard), the darkest derived shade is verified against the page
 * background before the color is allowed to save.
 */
export async function updateThemeAction(
  _prev: ThemeActionState,
  formData: FormData,
): Promise<ThemeActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const parsed = themeSettingsSchema.safeParse({
    primaryColor: formData.get("primaryColor"),
    accentColor: formData.get("accentColor"),
  });
  if (!parsed.success) return { error: "invalid_input" };

  const brandScale = buildBrandScale(parsed.data.primaryColor);
  if (contrastRatio(brandScale["900"], PAPER) < MIN_TEXT_CONTRAST) {
    return { error: "contrast_too_low" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("theme_settings")
    .update({
      primary_color: parsed.data.primaryColor,
      accent_color: parsed.data.accentColor,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);

  if (error) return { error: "save_failed" };

  revalidatePath("/", "layout");
  revalidatePath("/admin/theme");
  return { error: null };
}
