"use server";

import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validation/auth";
import { ensureActiveCart } from "@/lib/cart/resolve";
import { getSiteUrl } from "@/lib/site-url";

export type AuthActionState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
};

export async function signInAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "invalid_input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.code === "invalid_credentials" ? "invalid_credentials" : "sign_in_failed" };
  }

  // Claim/merge any guest cart into the now-authenticated user's cart
  // immediately, so the cart page reflects it without needing another
  // write action first.
  await ensureActiveCart();

  return { error: null };
}

export async function signUpAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "invalid_input", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
      },
    },
  });

  if (error) {
    return {
      error: error.code === "user_already_exists" ? "email_taken" : "sign_up_failed",
    };
  }

  return { error: null };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

/**
 * Always returns success regardless of whether the email matches an
 * account — this is Supabase Auth's own documented behavior for
 * resetPasswordForEmail (it never reveals whether an email is
 * registered), and the UI deliberately mirrors that rather than adding
 * an enumeration oracle on top of it.
 */
export async function requestPasswordResetAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/reset-password`,
  });

  return { error: null };
}

/** Only valid inside the short-lived recovery session created by the
 * /auth/callback exchange after a reset-password email link — there is no
 * separate "current password" check here because Supabase Auth already
 * required possession of the emailed link to reach this session. */
export async function resetPasswordAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) return { error: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: "reset_failed" };

  return { error: null };
}
