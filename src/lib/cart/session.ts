import { cookies } from "next/headers";

const CART_COOKIE = "novel_cart_id";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

/** Read-only: safe to call from Server Components. */
export async function readGuestCartId(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

/** Mutates cookies — only callable from a Server Action or Route Handler. */
export async function writeGuestCartId(cartId: string): Promise<void> {
  const store = await cookies();
  store.set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
}

/** Mutates cookies — only callable from a Server Action or Route Handler. */
export async function clearGuestCartId(): Promise<void> {
  const store = await cookies();
  store.delete(CART_COOKIE);
}
