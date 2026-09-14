"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function switchTo(nextLocale: "ar" | "en") {
    router.replace(
      // @ts-expect-error -- pathname may include dynamic params typed loosely here
      { pathname, params },
      { locale: nextLocale },
    );
  }

  return (
    <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider">
      <button
        type="button"
        onClick={() => switchTo("ar")}
        aria-current={locale === "ar"}
        className={locale === "ar" ? "text-brand-900" : "text-brand-400 hover:text-brand-700"}
      >
        عربي
      </button>
      <span className="text-brand-300">/</span>
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-current={locale === "en"}
        className={locale === "en" ? "text-brand-900" : "text-brand-400 hover:text-brand-700"}
      >
        EN
      </button>
    </div>
  );
}
