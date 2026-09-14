import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type SiteContentRow = Database["public"]["Tables"]["site_content"]["Row"];
export type Faq = Database["public"]["Tables"]["faqs"]["Row"];

/** All site_content rows keyed by `key` — publicly readable (site_content_public_read RLS). */
export async function getSiteContentMap(): Promise<Record<string, SiteContentRow>> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("*");
  const map: Record<string, SiteContentRow> = {};
  for (const row of data ?? []) map[row.key] = row;
  return map;
}

/** Single content value for a locale, falling back to `fallback` when the
 * row or that locale's column is missing (never a hard failure — content
 * rows are optional overrides, not required data). */
export function pickContent(
  map: Record<string, SiteContentRow>,
  key: string,
  locale: string,
  fallback: string,
): string {
  const row = map[key];
  if (!row) return fallback;
  const value = locale === "ar" ? row.value_ar : row.value_en;
  return value && value.trim() !== "" ? value : fallback;
}

export async function getFaqs(params: { activeOnly: boolean }): Promise<Faq[]> {
  const supabase = await createClient();
  let query = supabase.from("faqs").select("*").order("sort_order", { ascending: true });
  if (params.activeOnly) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
