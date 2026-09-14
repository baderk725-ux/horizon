"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { signOutAction } from "@/lib/actions/auth";

export function SignOutButton({ className }: { className?: string }) {
  const t = useTranslations("auth");
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await signOutAction();
          window.location.reload();
        })
      }
      className={className ?? "hover:text-accent-600"}
    >
      {t("signOut")}
    </button>
  );
}
