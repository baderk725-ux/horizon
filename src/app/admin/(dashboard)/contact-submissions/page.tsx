import { AdminPageHeader, AdminCard } from "../_components/ui";
import { SubmissionRow } from "./SubmissionRow";
import { getContactSubmissions } from "@/lib/submissions";

export default async function AdminContactSubmissionsPage() {
  const submissions = await getContactSubmissions();

  return (
    <div>
      <AdminPageHeader
        title="Contact Submissions"
        description={`${submissions.length} messages received via the storefront contact form.`}
      />

      {submissions.length === 0 ? (
        <AdminCard>
          <p className="text-sm text-[#6b5c48]">No submissions yet.</p>
        </AdminCard>
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-[#e2d8c8] text-xs uppercase tracking-[0.08em] text-[#9a8b73]">
              <tr>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <SubmissionRow key={s.id} submission={s} />
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}
    </div>
  );
}
