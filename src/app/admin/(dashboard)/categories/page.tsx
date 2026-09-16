import Link from "next/link";
import { AdminPageHeader, AdminCard, AdminLinkButton } from "../_components/ui";
import { getCategories } from "@/lib/categories";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description={`${categories.length} categories.`}
        action={<AdminLinkButton href="/admin/categories/new">Add Category</AdminLinkButton>}
      />

      <AdminCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-[#e2d8c8] text-xs uppercase tracking-[0.08em] text-[#9a8b73]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Sort Order</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-[#f0e9dc] last:border-0">
                <td className="px-4 py-3 font-medium text-[#1a1714]">{c.name}</td>
                <td className="px-4 py-3 text-[#6b5c48]">{c.slug}</td>
                <td className="px-4 py-3 text-[#6b5c48]">{c.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/categories/${c.id}`}
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
