import { createClient } from "./supabase/server";
import type { HomepageContent } from "./types";

const DEFAULTS: HomepageContent = {
  hero: {
    eyebrow: "Autumn Collection",
    heading: "Objects for a considered home.",
    primaryCta: "Shop Collection",
    primaryHref: "/shop",
    secondaryCta: "Explore NOVEL",
    secondaryHref: "/about",
  },
  featured_collection: {
    eyebrow: "Featured Collection",
    heading: "The Art of Home",
    description:
      "Thoughtfully selected pieces designed to bring warmth, texture and character into everyday spaces.",
    ctaLabel: "Explore Collection",
    ctaHref: "/shop",
  },
  brand_story: {
    eyebrow: "Our Story",
    heading: "A brand built on material, not trend.",
    description: "",
    ctaLabel: "Discover Our Story",
    ctaHref: "/about",
  },
  editorial: {
    eyebrow: "Journal",
    heading: "Details make the space.",
    description: "",
    ctaLabel: "Read the Journal",
    ctaHref: "/journal",
  },
};

export async function getHomepageContent(): Promise<HomepageContent> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("homepage_content").select("key, value");
  if (error) throw error;

  const content = { ...DEFAULTS };
  for (const row of data ?? []) {
    if (row.key in content) {
      (content as Record<string, unknown>)[row.key] = row.value;
    }
  }
  return content;
}

export async function updateHomepageSection(
  key: keyof HomepageContent,
  value: HomepageContent[keyof HomepageContent]
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("homepage_content")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}
