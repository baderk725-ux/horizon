import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type GovernorateWithAreas = Database["public"]["Tables"]["governorates"]["Row"] & {
  areas: Database["public"]["Tables"]["delivery_areas"]["Row"][];
};

/**
 * Governorates with their active + configured delivery areas — mirrors
 * exactly what enforce_configured_delivery_area() requires at the DB
 * level, so nothing offered in the checkout dropdown can ever fail that
 * trigger.
 */
export async function getGovernoratesWithAreas(): Promise<GovernorateWithAreas[]> {
  const supabase = await createClient();

  const [{ data: governorates, error: govError }, { data: areas, error: areaError }] =
    await Promise.all([
      supabase.from("governorates").select("*").order("name_en", { ascending: true }),
      supabase
        .from("delivery_areas")
        .select("*")
        .eq("is_active", true)
        .eq("is_configured", true)
        .order("name_en", { ascending: true }),
    ]);

  if (govError) throw govError;
  if (areaError) throw areaError;

  return (governorates ?? []).map((g) => ({
    ...g,
    areas: (areas ?? []).filter((a) => a.governorate_id === g.id),
  }));
}
