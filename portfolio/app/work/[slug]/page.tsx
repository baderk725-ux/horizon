import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectArt } from "@/components/work/ProjectArt";
import { conceptLabel, getProject, projects } from "@/content/projects";
import { creativeWorkLd, jsonLd } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.kind} (concept)`,
    description: `${p.summary} ${conceptLabel}.`,
    alternates: { canonical: `/work/${p.slug}` },
  };
}

export default async function CaseStudy({ params }: Params) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length]!;

  return (
    <article style={{ ["--accent" as string]: p.accent }} className="pt-28 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(creativeWorkLd(p)) }} />

      <header className="container-site">
        <Link href="/#work" className="label inline-flex min-h-11 items-center gap-2 text-muted hover:text-silver">
          <ArrowLeft aria-hidden="true" size={14} /> All work
        </Link>
        <p className="label mt-10 text-[var(--accent)]">
          {p.index} / 0{projects.length} · {p.kind}
        </p>
        <h1 className="display wdth-125 mt-4 text-display-xl text-silver">{p.name}</h1>
        <p className="mt-6 max-w-[52ch] text-title text-silver">{p.summary}</p>
        <p className="label mt-6 inline-flex rounded-pill border border-accent/40 px-3 py-2 text-accent">{conceptLabel}</p>

        <dl className="mt-12 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
          <div>
            <dt className="label text-muted">Role</dt>
            <dd className="mt-2 text-silver">{p.role.join(", ")}</dd>
          </div>
          <div>
            <dt className="label text-muted">Stack</dt>
            <dd className="mt-2 text-silver">{p.stack.join(", ")}</dd>
          </div>
          <div>
            <dt className="label text-muted">Year</dt>
            <dd className="mt-2 text-silver">{p.year} · Self-initiated</dd>
          </div>
        </dl>
      </header>

      <div className="container-site mt-16">
        <div className="aspect-[16/10] overflow-hidden rounded-sm border border-line">
          <ProjectArt project={p} />
        </div>
      </div>

      <section className="container-site mt-24 grid gap-10 md:grid-cols-12" aria-labelledby="brief">
        <h2 id="brief" className="label text-muted md:col-span-3">The brief</h2>
        <p className="text-title text-silver md:col-span-8">{p.brief}</p>
      </section>

      <section className="container-site mt-20 grid gap-10 md:grid-cols-12" aria-labelledby="approach">
        <h2 id="approach" className="label text-muted md:col-span-3">Approach</h2>
        <p className="max-w-[60ch] text-silver md:col-span-8">{p.approach}</p>
      </section>

      <section className="container-site mt-20" aria-labelledby="decisions">
        <h2 id="decisions" className="label text-muted">Key decisions</h2>
        <ol className="mt-8 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-3">
          {p.decisions.map((d, n) => (
            <li key={d.title} className="bg-obsidian p-6 md:p-8">
              <span className="label text-[var(--accent)]">0{n + 1}</span>
              <h3 className="mt-4 text-title text-silver">{d.title}</h3>
              <p className="mt-3 text-muted">{d.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-site mt-20" aria-labelledby="demo">
        <div className="rounded-sm border border-dashed border-line p-8 md:p-12">
          <p className="label text-muted">Showcase</p>
          <h2 id="demo" className="mt-4 text-title text-silver">{p.demo.title}</h2>
          <p className="mt-3 max-w-[60ch] text-muted">{p.demo.body}</p>
          <p className="label mt-6 text-accent">In production. Arrives with the showcase phase.</p>
        </div>
      </section>

      <nav aria-label="Next project" className="container-site mt-32 border-t border-line py-16">
        <p className="label text-muted">Next concept</p>
        <Link href={`/work/${next.slug}`} className="group mt-4 flex items-end justify-between gap-6">
          <span className="display wdth-125 text-display-l text-silver transition-colors group-hover:text-accent">{next.name}</span>
          <ArrowUpRight aria-hidden="true" size={40} className="mb-3 shrink-0 text-silver transition-transform duration-300 ease-flow group-hover:-translate-y-1 group-hover:translate-x-1" />
        </Link>
        <div className="mt-16">
          <ButtonLink href="/start">Start a project</ButtonLink>
        </div>
      </nav>
    </article>
  );
}
