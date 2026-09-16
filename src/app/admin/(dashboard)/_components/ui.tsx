import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl text-[#1a1714]">{title}</h1>
        {description ? <p className="mt-2 max-w-xl text-sm text-[#6b5c48]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`border border-[#e2d8c8] bg-white p-6 ${className}`}>{children}</div>;
}

export function AdminButton({
  variant = "primary",
  className = "",
  ...props
}: { variant?: "primary" | "secondary" | "danger" } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<string, string> = {
    primary: "bg-[#1a1714] text-white hover:bg-[#2a2622]",
    secondary: "border border-[#d8c6a8] text-[#1a1714] hover:bg-[#f3ecdf]",
    danger: "bg-red-700 text-white hover:bg-red-800",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] transition-colors disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function AdminLinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 bg-[#1a1714] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-white hover:bg-[#2a2622]"
    >
      {children}
    </Link>
  );
}

export function AdminField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.1em] text-[#6b5c48]">{label}</span>
      {children}
      {hint ? <span className="text-xs text-[#9a8b73]">{hint}</span> : null}
    </label>
  );
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`border border-[#e2d8c8] bg-white px-3 py-2.5 text-sm text-[#1a1714] focus:border-[#1a1714] focus:outline-none ${props.className ?? ""}`}
    />
  );
}

export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`border border-[#e2d8c8] bg-white px-3 py-2.5 text-sm text-[#1a1714] focus:border-[#1a1714] focus:outline-none ${props.className ?? ""}`}
    />
  );
}

export function AdminCheckboxLabel(props: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  return <label {...props} className={`flex items-center gap-2 text-sm text-[#1a1714] ${props.className ?? ""}`} />;
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <AdminCard>
      <p className="text-xs uppercase tracking-[0.1em] text-[#9a8b73]">{label}</p>
      <p className="mt-2 font-serif text-3xl text-[#1a1714]">{value}</p>
    </AdminCard>
  );
}
