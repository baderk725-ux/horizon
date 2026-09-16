import { createClient } from "./supabase/server";
import type { ContactSubmission, NewsletterSubscriber } from "./types";

export async function submitContactForm(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
  });
  if (error) throw error;
}

export async function subscribeToNewsletter(email: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
  if (error) throw error;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));
}

export async function markContactSubmissionRead(id: string, isRead: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ is_read: isRead })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteContactSubmission(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
  if (error) throw error;
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
  }));
}

export async function deleteNewsletterSubscriber(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
  if (error) throw error;
}
