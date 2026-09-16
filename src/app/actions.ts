"use server";

import { submitContactForm, subscribeToNewsletter } from "@/lib/submissions";

export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function submitContactAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in your name, email and message." };
  }

  try {
    await submitContactForm({ name, email, subject, message });
    return { status: "success" };
  } catch {
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}

export async function subscribeNewsletterAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { status: "error", message: "Please enter your email address." };
  }

  try {
    await subscribeToNewsletter(email);
    return { status: "success" };
  } catch {
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
