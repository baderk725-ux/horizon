import { createClient } from "./supabase/server";
import type { SiteSettings } from "./types";

interface SettingsRow {
  site_name: string;
  seo_title: string;
  seo_description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
}

function mapSettings(row: SettingsRow): SiteSettings {
  return {
    siteName: row.site_name,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    address: row.address,
    instagramUrl: row.instagram_url,
    facebookUrl: row.facebook_url,
    tiktokUrl: row.tiktok_url,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (error) throw error;
  return mapSettings(data);
}

export async function updateSiteSettings(settings: SiteSettings) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name: settings.siteName,
      seo_title: settings.seoTitle,
      seo_description: settings.seoDescription,
      contact_email: settings.contactEmail,
      contact_phone: settings.contactPhone,
      address: settings.address,
      instagram_url: settings.instagramUrl,
      facebook_url: settings.facebookUrl,
      tiktok_url: settings.tiktokUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) throw error;
}
