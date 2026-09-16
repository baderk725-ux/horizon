"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs uppercase tracking-[0.14em] text-white/50">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="border border-white/15 bg-[#0f0d0b] px-4 py-3 text-sm text-ivory focus:border-white/40 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-xs uppercase tracking-[0.14em] text-white/50">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="border border-white/15 bg-[#0f0d0b] px-4 py-3 text-sm text-ivory focus:border-white/40 focus:outline-none"
        />
      </div>
      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 bg-ivory px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-[#0f0d0b] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
