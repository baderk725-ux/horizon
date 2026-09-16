import type { Metadata } from "next";
import { AdminSidebar } from "./AdminSidebar";

export const metadata: Metadata = {
  title: { default: "Admin — NOVEL", template: "%s — NOVEL Admin" },
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f5f3f0] font-sans text-[#1a1714]">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        <main className="mx-auto max-w-6xl px-8 py-10">{children}</main>
      </div>
    </div>
  );
}
