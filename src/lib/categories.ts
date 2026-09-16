import { createClient } from "./supabase/server";
import type { Category } from "./types";

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  placeholder_icon: string;
  placeholder_tone: string;
  image_url: string | null;
  sort_order: number;
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    placeholderIcon: row.placeholder_icon as Category["placeholderIcon"],
    placeholderTone: row.placeholder_tone as Category["placeholderTone"],
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapCategory);
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapCategory(data) : undefined;
}
