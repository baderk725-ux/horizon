import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EditorialImage } from "@/components/EditorialImage";
import { journalPosts } from "@/lib/journal";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on craft, material and interiors from the NOVEL studio.",
};

export default function JournalPage() {
  return (
    <div className="container-editorial py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal" }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-serif text-4xl md:text-5xl">The Journal</h1>
        <p className="mt-4 text-base leading-relaxed text-stone">
          Notes on craft, material, and how to live with the things you own.
        </p>
      </div>

      <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
        {journalPosts.map((post) => (
          <Link key={post.slug} href={`/journal/${post.slug}`} className="group flex flex-col gap-4">
            <div className="aspect-[3/2] overflow-hidden bg-cream">
              <div className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
                <EditorialImage icon={post.image} tone="sand" alt={post.title} className="h-full w-full" />
              </div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-[0.14em] text-stone">
                {post.category} &middot; {formatDate(post.date)}
              </span>
              <h2 className="mt-2 font-serif text-2xl leading-snug group-hover:text-espresso">{post.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-stone">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
