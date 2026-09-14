import { clsx } from "clsx";

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-xs font-medium uppercase tracking-wider text-brand-700">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({
  className,
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      aria-invalid={invalid}
      className={clsx(
        "w-full rounded-(--radius-button) border bg-paper px-4 py-3 font-sans text-sm text-brand-900 placeholder:text-brand-400",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1",
        invalid ? "border-danger" : "border-brand-300",
        className,
      )}
      {...props}
    />
  );
}
