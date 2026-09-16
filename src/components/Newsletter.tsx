"use client";

import { useActionState } from "react";
import { subscribeNewsletterAction, type FormState } from "@/app/actions";

const initialState: FormState = { status: "idle" };

export function Newsletter({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [state, formAction, pending] = useActionState(subscribeNewsletterAction, initialState);
  const isLight = tone === "light";

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h2 className={`font-serif text-3xl md:text-4xl ${isLight ? "text-ivory" : "text-charcoal"}`}>
        Stay Close to NOVEL
      </h2>
      <p className={`max-w-md text-sm leading-relaxed ${isLight ? "text-ivory/70" : "text-stone"}`}>
        Discover new collections, thoughtful pieces and inspiration for your home.
      </p>
      {state.status === "success" ? (
        <p className={`text-sm ${isLight ? "text-ivory" : "text-charcoal"}`}>
          Thank you — you&rsquo;re on the list.
        </p>
      ) : (
        <form action={formAction} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder="Your email address"
            className={`w-full border px-4 py-3 text-sm placeholder:text-current/50 focus:outline-none ${
              isLight
                ? "border-ivory/30 bg-transparent text-ivory placeholder:text-ivory/50"
                : "border-line bg-ivory text-charcoal"
            }`}
          />
          <button
            type="submit"
            disabled={pending}
            className={`shrink-0 px-6 py-3 text-xs uppercase tracking-[0.14em] transition-colors disabled:opacity-50 ${
              isLight
                ? "bg-ivory text-charcoal hover:bg-ivory/90"
                : "bg-charcoal text-ivory hover:bg-espresso"
            }`}
          >
            {pending ? "Subscribing…" : "Subscribe"}
          </button>
          {state.status === "error" ? (
            <p className="sm:col-span-2 text-xs text-red-700">{state.message}</p>
          ) : null}
        </form>
      )}
    </div>
  );
}
