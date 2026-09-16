"use server";

import { revalidatePath } from "next/cache";
import { deleteNewsletterSubscriber } from "@/lib/submissions";

export async function deleteSubscriberAction(id: string) {
  await deleteNewsletterSubscriber(id);
  revalidatePath("/admin/newsletter");
}
