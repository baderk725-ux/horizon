import { SectionLabel } from "@/components/ui/SectionLabel";
import { capabilities } from "@/content/capabilities";

/** SCENE 03 — INTERFACE. Four capability areas. */
export function Interface() {
  return (
    <section id="capabilities" data-chapter="2" aria-labelledby="interface-title" className="relative py-32 md:py-48">
      <div className="container-site">
        <SectionLabel index="03">Capabilities</SectionLabel>
        <h2 id="interface-title" className="display wdth-118 mt-8 text-display-m text-silver">
          Four ways
          <br />I work<span className="text-lime">.</span>
        </h2>

        {/* Reserved stage for the Flow-built panels (3D layer). */}
        <div aria-hidden="true" className="h-[36vh] md:h-[46vh]" />

        <ol className="grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((c) => (
            <li key={c.index} className="flex flex-col gap-5 bg-obsidian p-6 md:p-8">
              <span className="label text-lime">{c.index}</span>
              <h3 className="text-title text-silver">{c.title}</h3>
              <p className="text-muted">{c.body}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                {c.items.map((it) => (
                  <li key={it} className="label rounded-pill border border-line px-3 py-1.5 text-silver">
                    {it}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
