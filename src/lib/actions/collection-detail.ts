"use server";

import { getAdminCollectionById, type AdminCollectionDetail } from "@/lib/data/admin/collections";
import { getCurrentUser, isAdmin } from "@/lib/data/auth";

export async function getCollectionDetailAction(id: string): Promise<AdminCollectionDetail | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return null;
  return getAdminCollectionById(id);
}
