import { getTranslations, getLocale } from "next-intl/server";
import { getAdminNotifications } from "@/lib/data/admin/notifications";
import { NotificationList } from "@/components/admin/notification-list";

export default async function AdminNotificationsPage(props: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("adminNotifications");
  const locale = await getLocale();
  const unreadOnly = searchParams.filter === "unread";
  const notifications = await getAdminNotifications({ unreadOnly });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={`/${locale}/admin/notifications`}
          className={`rounded-(--radius-pill) px-4 py-1.5 text-xs font-medium uppercase tracking-wider ${
            !unreadOnly ? "bg-brand-900 text-paper" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
          }`}
        >
          {t("all")}
        </a>
        <a
          href={`/${locale}/admin/notifications?filter=unread`}
          className={`rounded-(--radius-pill) px-4 py-1.5 text-xs font-medium uppercase tracking-wider ${
            unreadOnly ? "bg-brand-900 text-paper" : "bg-brand-100 text-brand-700 hover:bg-brand-200"
          }`}
        >
          {t("unreadOnly")}
        </a>
      </div>

      <NotificationList notifications={notifications} />
    </div>
  );
}
