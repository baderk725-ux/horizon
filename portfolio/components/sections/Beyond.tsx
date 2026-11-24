import { ButtonLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { site } from "@/lib/site";

/** SCENE 06 — BEYOND. The portal + the primary conversion. */
export function Beyond() {
  return (
    <section
      id="contact"
      data-chapter="5"
      aria-labelledby="beyond-title"
      className="relative flex min-h-[100svh] items-center py-32"
    >
      {/* Radial scrim keeps copy legible over the particles (frame review m06) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(9,10,13,0.72)_0%,rgba(9,10,13,0.35)_38%,transparent_68%)]"
      />
      <div className="container-site relative flex flex-col items-center text-center">
        <SectionLabel index="06">Contact</SectionLabel>
        <h2 id="beyond-title" className="display wdth-118 mt-8 text-display-l text-silver">
          Let&apos;s build
          <br />
          what&apos;s next<span className="text-lime">.</span>
        </h2>
        <p className="mt-8 max-w-[44ch] text-muted">
          Have a website, an experience or an AI product in mind? Tell me about it. Every project starts with a conversation.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/start">Start a project</ButtonLink>
          {site.email && (
            <ButtonLink href={`mailto:${site.email}`} variant="secondary" icon={false}>
              {site.email}
            </ButtonLink>
          )}
        </div>
        {site.availability && <p className="label mt-8 text-muted">{site.availability}</p>}
      </div>
    </section>
  );
}
