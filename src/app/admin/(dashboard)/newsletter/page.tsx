import { AdminPageHeader, AdminCard } from "../_components/ui";
import { SubscriberRow } from "./SubscriberRow";
import { getNewsletterSubscribers } from "@/lib/submissions";

export default async function AdminNewsletterPage() {
  const subscribers = await getNewsletterSubscribers();

  return (
    <div>
      <AdminPageHeader
        title="Newsletter Subscribers"
        description={`${subscribers.length} subscribers collected from the storefront footer.`}
      />

      {subscribers.length === 0 ? (
        <AdminCard>
          <p className="text-sm text-[#6b5c48]">No subscribers yet.</p>
        </AdminCard>
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="border-b border-[#e2d8c8] text-xs uppercase tracking-[0.08em] text-[#9a8b73]">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Subscribed</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <SubscriberRow key={s.id} subscriber={s} />
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}
    </div>
  );
}
