"use server";

import { getCurrentUser, isSuperAdmin } from "@/lib/data/auth";
import { searchPromotableCustomers, type StaffProfile } from "@/lib/data/admin/staff";

export async function searchPromotableCustomersAction(term: string): Promise<StaffProfile[]> {
  const current = await getCurrentUser();
  if (!current || !isSuperAdmin(current.profile)) return [];
  return searchPromotableCustomers(term);
}
