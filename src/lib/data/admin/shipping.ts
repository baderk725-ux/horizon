import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type GovernorateRow = Database["public"]["Tables"]["governorates"]["Row"];
export type DeliveryAreaRow = Database["public"]["Tables"]["delivery_areas"]["Row"];

export type GovernorateWithAreas = GovernorateRow & { areas: DeliveryAreaRow[] };

/** All governorates with all their delivery areas (active or not) — the
 * admin needs to see and manage inactive/unconfigured zones too, unlike
 * the storefront checkout picker which only shows active+configured. */
export async function getShippingZones(): Promise<GovernorateWithAreas[]> {
  const supabase = await createClient();
  const [{ data: governorates, error: govError }, { data: areas, error: areaError }] =
    await Promise.all([
      supabase.from("governorates").select("*").order("name_en", { ascending: true }),
      supabase.from("delivery_areas").select("*").order("name_en", { ascending: true }),
    ]);

  if (govError) throw govError;
  if (areaError) throw areaError;

  return (governorates ?? []).map((g) => ({
    ...g,
    areas: (areas ?? []).filter((a) => a.governorate_id === g.id),
  }));
}
