import { clsx } from "clsx";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-(--radius-button) font-sans text-sm font-medium tracking-wide uppercase transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand-900 text-paper hover:bg-brand-800",
  secondary:
    "bg-transparent text-brand-900 border border-brand-900 hover:bg-brand-900 hover:text-paper",
  ghost: "bg-transparent text-brand-900 hover:bg-brand-100",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3",
  lg: "px-8 py-4 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps &
  React.ComponentProps<typeof Link> & { href: React.ComponentProps<typeof Link>["href"] }) {
  return (
    <Link
      href={href}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
