import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login — NOVEL",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0d0b] px-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-serif text-2xl tracking-[0.18em] text-ivory">NOVEL</span>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/40">Admin Console</p>
        </div>
        <div className="border border-white/10 bg-[#171310] p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
