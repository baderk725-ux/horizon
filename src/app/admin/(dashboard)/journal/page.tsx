import Link from "next/link";
import { AdminPageHeader, AdminCard, AdminLinkButton } from "../_components/ui";
import { getJournalPosts } from "@/lib/journal";
import { formatDate } from "@/lib/format";

export default async function AdminJournalPage() {
  const posts = await getJournalPosts();

  return (
    <div>
      <AdminPageHeader
        title="Journal"
        description={`${posts.length} posts.`}
        action={<AdminLinkButton href="/admin/journal/new">New Post</AdminLinkButton>}
      />

      <AdminCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[#e2d8c8] text-xs uppercase tracking-[0.08em] text-[#9a8b73]">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-[#f0e9dc] last:border-0">
                <td className="px-4 py-3 font-medium text-[#1a1714]">{p.title}</td>
                <td className="px-4 py-3 text-[#6b5c48]">{p.category}</td>
                <td className="px-4 py-3 text-[#6b5c48]">{formatDate(p.date)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs uppercase tracking-[0.08em] ${
                      p.isPublished ? "bg-[#e6f0e6] text-green-800" : "bg-[#f0e9dc] text-[#9a8b73]"
                    }`}
                  >
                    {p.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/journal/${p.id}`}
                    className="text-xs uppercase tracking-[0.08em] text-[#1a1714] underline underline-offset-4"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </div>
  );
}
