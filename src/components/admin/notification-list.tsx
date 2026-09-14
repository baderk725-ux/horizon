"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { markNotificationReadAction, markAllNotificationsReadAction } from "@/lib/actions/notifications";
import { Button } from "@/components/ui/button";
import type { AdminNotificationRow } from "@/lib/data/admin/notifications";

export function NotificationList({ notifications }: { notifications: AdminNotificationRow[] }) {
  const t = useTranslations("adminNotifications");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const hasUnread = notifications.some((n) => !n.is_read);

  function markRead(id: string) {
    startTransition(async () => {
      await markNotificationReadAction(id);
      router.refresh();
    });
  }

  function markAllRead() {
    startTransition(async () => {
      await markAllNotificationsReadAction();
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {hasUnread && (
        <div className="flex justify-end">
          <Button type="button" size="sm" variant="ghost" disabled={pending} onClick={markAllRead}>
            {t("markAllRead")}
          </Button>
        </div>
      )}

      {notifications.length === 0 ? (
        <p className="text-sm text-brand-500">{t("empty")}</p>
      ) : (
        <ul className="divide-y divide-brand-200 rounded-(--radius-card) border border-brand-200 bg-paper">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`flex items-start justify-between gap-4 px-5 py-4 ${n.is_read ? "" : "bg-accent-50"}`}
            >
              <div className="min-w-0">
                {n.link ? (
                  <Link
                    href={n.link}
                    onClick={() => !n.is_read && markRead(n.id)}
                    className="font-medium text-brand-900 hover:underline"
                  >
                    {n.title}
                  </Link>
                ) : (
                  <p className="font-medium text-brand-900">{n.title}</p>
                )}
                {n.message && <p className="mt-0.5 text-sm text-brand-600">{n.message}</p>}
                <p className="mt-1 text-xs text-brand-400">
                  {new Intl.DateTimeFormat("en-JO", { dateStyle: "medium", timeStyle: "short" }).format(
                    new Date(n.created_at),
                  )}
                </p>
              </div>
              {!n.is_read && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => markRead(n.id)}
                  className="shrink-0 text-xs font-medium text-brand-700 hover:underline disabled:opacity-50"
                >
                  {t("markRead")}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
