import Link from "next/link";
import { AdminPageHeader, AdminCard, AdminLinkButton } from "../_components/ui";
import { getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description={`${products.length} products in the catalog.`}
        action={<AdminLinkButton href="/admin/products/new">Add Product</AdminLinkButton>}
      />

      <AdminCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[#e2d8c8] text-xs uppercase tracking-[0.08em] text-[#9a8b73]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[#f0e9dc] last:border-0">
                <td className="px-4 py-3 font-medium text-[#1a1714]">{p.name}</td>
                <td className="px-4 py-3 capitalize text-[#6b5c48]">{p.category.replace("-", " ")}</td>
                <td className="px-4 py-3 text-[#6b5c48]">{formatPrice(p.price, p.currency)}</td>
                <td className="px-4 py-3 text-[#6b5c48]">{p.inStock ? "In stock" : "Out of stock"}</td>
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
                    href={`/admin/products/${p.id}`}
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
