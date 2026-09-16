import { AdminPageHeader, AdminCard } from "../_components/ui";
import { SettingsForm } from "./SettingsForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { getSiteSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <AdminPageHeader title="Settings" description="Site-wide details, contact info and SEO defaults." />

      <div className="flex flex-col gap-6">
        <AdminCard>
          <SettingsForm settings={settings} />
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 font-serif text-xl text-[#1a1714]">Admin Account</h2>
          <p className="mb-4 text-sm text-[#6b5c48]">
            Change the password for this admin account. You&rsquo;ll stay signed in on this device.
          </p>
          <ChangePasswordForm />
        </AdminCard>
      </div>
    </div>
  );
}
