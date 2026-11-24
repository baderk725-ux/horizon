import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectArt } from "@/components/work/ProjectArt";
import { conceptLabel, projects } from "@/content/projects";

/** SCENE 04 — WORK. Four independent concepts (always labelled). */
export function Work() {
  return (
    <section id="work" data-chapter="3" aria-labelledby="work-title" className="relative py-32 md:py-48">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel index="04">Selected work</SectionLabel>
            <h2 id="work-title" className="display wdth-118 mt-8 text-display-m text-silver">
              Concepts
              <br />
              in motion<span className="text-lime">.</span>
            </h2>
          </div>
          <p className="label max-w-[38ch] text-muted">
            Four self-initiated concept projects, designed and built to show range. {conceptLabel}.
          </p>
        </div>

        <ul className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}`} className="group block" aria-label={`${p.name} — ${p.kind}. ${conceptLabel}`}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line">
                  <ProjectArt project={p} />
                </div>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <p className="label text-muted">
                      {p.index} · {p.kind}
                    </p>
                    <h3 className="display wdth-125 mt-2 text-display-m text-silver transition-colors group-hover:text-lime">
                      {p.name}
                    </h3>
                    <p className="mt-3 max-w-[48ch] text-muted">{p.summary}</p>
                    <p className="label mt-4 text-lime">Independent concept</p>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-silver transition-transform duration-300 ease-flow group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
