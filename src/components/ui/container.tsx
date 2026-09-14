import { clsx } from "clsx";

export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag className={clsx("mx-auto w-full max-w-(--container-max) px-4 sm:px-6 lg:px-10", className)}>
      {children}
    </Tag>
  );
}
