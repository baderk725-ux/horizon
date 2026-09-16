import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EditorialImage } from "@/components/EditorialImage";
import { journalPosts, getJournalPost } from "@/lib/journal";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) notFound();

  const more = journalPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="container-editorial py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal", href: "/journal" }, { label: post.title }]} />

      <header className="mx-auto mt-8 max-w-2xl text-center">
        <span className="text-xs uppercase tracking-[0.14em] text-stone">
          {post.category} &middot; {formatDate(post.date)}
        </span>
        <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{post.title}</h1>
      </header>

      <div className="mx-auto mt-10 aspect-[16/9] max-w-4xl overflow-hidden bg-cream">
        <EditorialImage icon={post.image} tone="sand" alt={post.title} className="h-full w-full" />
      </div>

      <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-6 text-base leading-relaxed text-charcoal">
        {post.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {more.length > 0 ? (
        <div className="mx-auto mt-20 max-w-4xl border-t border-line pt-12">
          <h2 className="font-serif text-2xl">More from the Journal</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {more.map((item) => (
              <Link key={item.slug} href={`/journal/${item.slug}`} className="group flex flex-col gap-3">
                <div className="aspect-[3/2] overflow-hidden bg-cream">
                  <EditorialImage icon={item.image} tone="taupe" alt={item.title} className="h-full w-full" />
                </div>
                <h3 className="font-serif text-lg group-hover:text-espresso">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
