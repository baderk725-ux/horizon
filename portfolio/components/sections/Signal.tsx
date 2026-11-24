import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

const LETTERS = site.name.toUpperCase().split("");

/** SCENE 01 — SIGNAL. The offer is in the first viewport (refinement 1). */
export function Signal() {
  return (
    <section
      id="top"
      data-chapter="0"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col justify-between pb-24 pt-28 md:pb-20 md:pt-32"
    >
      <div className="container-site" data-hero-out>
        <p className="label text-muted" data-hero-line>
          {site.concept}
          <br />
          <span className="text-silver">{site.role}</span>
        </p>
      </div>

      <div className="container-site flex justify-center py-10" data-hero-out>
        <h1
          id="hero-title"
          aria-label={`${site.name} — creative developer building premium websites, cinematic experiences and AI applications`}
          className="display wdth-125 relative select-none text-center text-display-xl text-silver"
          data-wordmark
        >
          {LETTERS.map((l, i) => (
            <span key={i} aria-hidden="true" data-letter className="inline-block">
              {l}
            </span>
          ))}
        </h1>
      </div>

      {/* Legibility scrim: the Flow passes behind the offer, never through it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(to_top,rgba(9,10,13,0.92)_0%,rgba(9,10,13,0.7)_45%,transparent_100%)] md:landscape:h-[42%] md:landscape:bg-[linear-gradient(to_top,rgba(9,10,13,0.85)_0%,rgba(9,10,13,0.4)_50%,transparent_100%)]"
      />
      <div className="container-site relative grid gap-8 md:grid-cols-12 md:items-end" data-hero-out>
        <div className="md:col-span-7 lg:col-span-6">
          <p className="max-w-[34ch] text-title text-silver" data-hero-line data-lcp>
            {site.offer}
          </p>
          <div className="mt-8 flex flex-wrap gap-3" data-hero-line>
            <ButtonLink href="/start">Start a project</ButtonLink>
            <ButtonLink href="/#work" variant="secondary" icon={false}>
              View work
            </ButtonLink>
          </div>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-5 md:flex-col md:items-end lg:col-span-6" data-hero-line aria-label="Services">
          {site.services.map((s, i) => (
            <li key={s} className="label flex items-center gap-3 text-muted">
              <span className="text-accent">0{i + 1}</span>
              <span className="text-silver">{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
