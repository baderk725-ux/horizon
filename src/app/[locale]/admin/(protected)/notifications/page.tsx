import { getTranslations } from "next-intl/server";
import { getAdminNotifications } from "@/lib/data/admin/notifications";
import { NotificationList } from "@/components/admin/notification-list";

export default async function AdminNotificationsPage() {
  const t = await getTranslations("adminNotifications");
  const notifications = await getAdminNotifications({});

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-display-sm text-brand-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-brand-500">{t("hint")}</p>
      </div>

      <NotificationList notifications={notifications} />
    </div>
  );
}
