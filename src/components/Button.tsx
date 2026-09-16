import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-charcoal text-ivory px-8 py-4 hover:bg-espresso",
  secondary: "border border-charcoal text-charcoal px-8 py-4 hover:bg-charcoal hover:text-ivory",
  ghost: "text-charcoal underline underline-offset-4 decoration-taupe hover:decoration-charcoal px-0 py-1",
};

interface CommonProps {
  variant?: Variant;
  className?: string;
}

interface ButtonAsButton extends CommonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  href?: undefined;
  children: ReactNode;
}

interface ButtonAsLink extends CommonProps {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  children: ReactNode;
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", className = "", children } = props;
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, target, rel, onClick } = props;
    return (
      <Link href={href} target={target} rel={rel} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _variant, className: _className, children: _children, ...rest } = props;
  void _variant;
  void _className;
  void _children;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
