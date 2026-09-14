import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const b = await getTranslations("brand");

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-muted px-4 py-16">
      <div className="w-full max-w-md rounded-(--radius-card) bg-paper p-8 shadow-(--shadow-card) sm:p-10">
        <Link href="/" className="block text-center font-display text-2xl text-brand-900">
          {b("name")}
        </Link>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
