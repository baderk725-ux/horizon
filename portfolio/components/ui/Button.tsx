import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group relative inline-flex min-h-11 items-center gap-3 rounded-pill px-6 py-3.5 text-[0.9375rem] font-medium leading-none transition-colors duration-300 ease-flow focus-visible:outline-offset-4";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-obsidian hover:bg-silver",
  secondary: "border border-line text-silver hover:border-silver",
  ghost: "px-0 text-silver underline decoration-line underline-offset-8 hover:decoration-accent",
};

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  icon?: boolean;
  className?: string;
  children: ReactNode;
}

/** Link-styled button. `data-magnetic` is picked up by the motion layer (Phase 5). */
export function ButtonLink({ variant = "primary", icon = true, className = "", children, ...props }: ButtonLinkProps) {
  return (
    <Link {...props} data-magnetic="" className={`${base} ${variants[variant]} ${className}`}>
      <span data-magnetic-inner="" className="inline-flex items-center gap-3">
        {children}
        {icon && (
          <ArrowUpRight
            aria-hidden="true"
            size={18}
            strokeWidth={1.75}
            className="transition-transform duration-300 ease-flow group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        )}
      </span>
    </Link>
  );
}

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}
