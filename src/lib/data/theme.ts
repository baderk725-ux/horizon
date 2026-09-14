import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type ThemeSettings = Database["public"]["Tables"]["theme_settings"]["Row"];

const DEFAULT_THEME = { primary_color: "#8b7561", accent_color: "#b08d57" };

/** Publicly readable singleton row (theme_settings_public_read RLS). Falls
 * back to the palette's original hand-tuned defaults if the row is somehow
 * missing, so a broken read never breaks page rendering. */
export async function getThemeSettings(): Promise<{ primary_color: string; accent_color: string }> {
  const supabase = await createClient();
  const { data } = await supabase.from("theme_settings").select("primary_color, accent_color").eq("id", true).maybeSingle();
  return data ?? DEFAULT_THEME;
}
