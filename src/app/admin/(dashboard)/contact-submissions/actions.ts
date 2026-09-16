"use server";

import { revalidatePath } from "next/cache";
import { markContactSubmissionRead, deleteContactSubmission } from "@/lib/submissions";

export async function toggleReadAction(id: string, isRead: boolean) {
  await markContactSubmissionRead(id, isRead);
  revalidatePath("/admin/contact-submissions");
}

export async function deleteSubmissionAction(id: string) {
  await deleteContactSubmission(id);
  revalidatePath("/admin/contact-submissions");
}
