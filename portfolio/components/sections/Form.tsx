import { SectionLabel } from "@/components/ui/SectionLabel";
import { site } from "@/lib/site";

/** SCENE 02 — FORM. Identity statement + about (facts only). */
export function Form() {
  return (
    <section id="about" data-chapter="1" aria-labelledby="form-title" className="relative py-32 md:py-48">
      <div className="container-site grid gap-14 md:grid-cols-12">
        <div className="md:col-span-8">
          <SectionLabel index="02">Identity</SectionLabel>
          <h2 id="form-title" className="display mt-8 text-silver">
            <span className="wdth-112 block text-display-l">I build</span>
            <span className="wdth-62 block text-[clamp(4.4rem,1.6rem+12vw,12rem)] font-bold leading-[0.86]">digital</span>
            <span className="wdth-125 block text-[clamp(2.1rem,0.4rem+5vw,5.25rem)] leading-[0.9]">
              experiences<span className="text-lime">.</span>
            </span>
          </h2>
        </div>
        <div className="flex flex-col justify-end gap-6 md:col-span-4">
          <p className="max-w-prose text-silver">
            I&apos;m Khaled, a creative developer, web designer and AI builder. I&apos;ve spent {site.experience.webYears} years
            designing and building for the web, and the last {site.experience.aiYears} building with AI.
          </p>
          <p className="max-w-prose text-muted">
            I care about the whole experience, from the first frame to the last interaction: how it looks, how it moves, how fast it
            loads and how intelligently it works.
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Experience">
            {[`${site.experience.webYears} yrs — Web`, `${site.experience.aiYears} yrs — AI`, "Design × Code"].map((t) => (
              <li key={t} className="label rounded-pill border border-line px-3 py-2 text-silver">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
