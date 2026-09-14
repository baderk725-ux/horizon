import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";
import { routing } from "@/i18n/routing";

/**
 * Exchanges a Supabase Auth email-link code (password recovery, and any
 * future magic-link/invite flow that reuses this same redirect) for a
 * session, then hands off to a normal locale-prefixed page. Lives outside
 * the [locale] segment since the email link is generated without knowing
 * the recipient's locale — falls back to the app's default locale rather
 * than guessing from request headers.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          },
        },
      },
    );
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/${routing.defaultLocale}${next}`);
}
