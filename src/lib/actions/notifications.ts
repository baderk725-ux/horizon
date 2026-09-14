"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";

export type NotificationActionState = { error: string | null };

async function requireAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return "not_authorized";
  return null;
}

export async function markNotificationReadAction(id: string): Promise<NotificationActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  if (error) return { error: "update_failed" };

  revalidatePath("/admin/notifications");
  revalidatePath("/admin");
  return { error: null };
}

export async function markAllNotificationsReadAction(): Promise<NotificationActionState> {
  const authError = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
  if (error) return { error: "update_failed" };

  revalidatePath("/admin/notifications");
  revalidatePath("/admin");
  return { error: null };
}
