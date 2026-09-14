"use server";

import { getCurrentUser, isAdmin } from "@/lib/data/auth";
import { getAdminBundleById, type AdminBundleDetail } from "@/lib/data/admin/bundles";

export async function getBundleDetailAction(id: string): Promise<AdminBundleDetail | null> {
  const current = await getCurrentUser();
  if (!current || !isAdmin(current.profile)) return null;
  return getAdminBundleById(id);
}
