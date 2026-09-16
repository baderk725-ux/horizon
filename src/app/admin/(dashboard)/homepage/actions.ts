"use server";

import { revalidatePath } from "next/cache";
import { updateHomepageSection } from "@/lib/homepage";
import type { EditorialSectionContent, HeroContent } from "@/lib/types";

export interface HomepageFormState {
  error?: string;
  saved?: boolean;
}

export async function updateHeroAction(
  _prevState: HomepageFormState,
  formData: FormData
): Promise<HomepageFormState> {
  const content: HeroContent = {
    eyebrow: String(formData.get("eyebrow") ?? ""),
    heading: String(formData.get("heading") ?? ""),
    primaryCta: String(formData.get("primaryCta") ?? ""),
    primaryHref: String(formData.get("primaryHref") ?? "/shop"),
    secondaryCta: String(formData.get("secondaryCta") ?? ""),
    secondaryHref: String(formData.get("secondaryHref") ?? "/about"),
  };
  try {
    await updateHomepageSection("hero", content);
  } catch {
    return { error: "Could not save the hero section." };
  }
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { saved: true };
}

export async function updateEditorialSectionAction(
  key: "featured_collection" | "brand_story" | "editorial",
  _prevState: HomepageFormState,
  formData: FormData
): Promise<HomepageFormState> {
  const content: EditorialSectionContent = {
    eyebrow: String(formData.get("eyebrow") ?? ""),
    heading: String(formData.get("heading") ?? ""),
    description: String(formData.get("description") ?? ""),
    ctaLabel: String(formData.get("ctaLabel") ?? ""),
    ctaHref: String(formData.get("ctaHref") ?? "/shop"),
  };
  try {
    await updateHomepageSection(key, content);
  } catch {
    return { error: "Could not save this section." };
  }
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { saved: true };
}
