import Link from "next/link";
import { AdminPageHeader, AdminCard, StatCard } from "./_components/ui";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import { getJournalPosts } from "@/lib/journal";
import { getContactSubmissions, getNewsletterSubscribers } from "@/lib/submissions";

export default async function AdminDashboardPage() {
  const [products, categories, journalPosts, contactSubmissions, newsletterSubscribers] =
    await Promise.all([
      getProducts(),
      getCategories(),
      getJournalPosts(),
      getContactSubmissions(),
      getNewsletterSubscribers(),
    ]);

  const unreadCount = contactSubmissions.filter((s) => !s.isRead).length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="An overview of your NOVEL storefront's content and activity."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Products" value={products.length} />
        <StatCard label="Categories" value={categories.length} />
        <StatCard label="Journal Posts" value={journalPosts.length} />
        <StatCard label="Newsletter Subscribers" value={newsletterSubscribers.length} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <AdminCard>
          <h2 className="font-serif text-xl text-[#1a1714]">Contact Submissions</h2>
          <p className="mt-2 text-sm text-[#6b5c48]">
            {contactSubmissions.length} total, {unreadCount} unread.
          </p>
          <Link
            href="/admin/contact-submissions"
            className="mt-4 inline-block text-xs uppercase tracking-[0.1em] text-[#1a1714] underline underline-offset-4"
          >
            View submissions
          </Link>
        </AdminCard>
        <AdminCard>
          <h2 className="font-serif text-xl text-[#1a1714]">Inventory</h2>
          <p className="mt-2 text-sm text-[#6b5c48]">
            {outOfStockCount} product{outOfStockCount === 1 ? "" : "s"} currently out of stock.
          </p>
          <Link
            href="/admin/products"
            className="mt-4 inline-block text-xs uppercase tracking-[0.1em] text-[#1a1714] underline underline-offset-4"
          >
            Manage products
          </Link>
        </AdminCard>
      </div>

      <div className="mt-6">
        <AdminCard>
          <h2 className="font-serif text-xl text-[#1a1714]">Quick Links</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <Link href="/admin/products/new" className="text-[#1a1714] underline underline-offset-4">
              Add a product
            </Link>
            <Link href="/admin/journal/new" className="text-[#1a1714] underline underline-offset-4">
              Write a journal post
            </Link>
            <Link href="/admin/homepage" className="text-[#1a1714] underline underline-offset-4">
              Edit homepage copy
            </Link>
            <Link href="/admin/settings" className="text-[#1a1714] underline underline-offset-4">
              Update site settings
            </Link>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
