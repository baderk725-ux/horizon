import { createClient } from "./supabase/server";
import type { JournalPost } from "./types";

interface JournalRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string;
  placeholder_icon: string;
  content: string[];
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
}

function mapPost(row: JournalRow): JournalPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.published_at,
    image: row.placeholder_icon as JournalPost["image"],
    content: row.content,
    isPublished: row.is_published,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}

export async function getJournalPosts(): Promise<JournalPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapPost);
}

export async function getJournalPost(slug: string): Promise<JournalPost | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapPost(data) : undefined;
}

export async function getJournalPostById(id: string): Promise<JournalPost | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapPost(data) : undefined;
}
