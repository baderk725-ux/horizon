import { SectionLabel } from "@/components/ui/SectionLabel";
import { toolGroups, tools } from "@/content/tools";

/** SCENE 05 — SYSTEM. Real tool list (DOM is primary; 3D orbits are ambient). */
export function System() {
  return (
    <section id="system" data-chapter="4" aria-labelledby="system-title" className="relative py-32 md:py-48">
      <div className="container-site grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <SectionLabel index="05">Technology</SectionLabel>
          <h2 id="system-title" className="display wdth-118 mt-8 text-display-m text-silver">
            The system<span className="text-lime">.</span>
          </h2>
          <p className="mt-6 max-w-[40ch] text-muted">
            The tools behind the work, chosen for speed, craft and reliability.
          </p>
        </div>
        <div className="md:col-span-7">
          <dl className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
            {toolGroups.map((g) => (
              <div key={g} className="bg-obsidian p-6">
                <dt className="label text-lime">{g}</dt>
                <dd className="mt-4">
                  <ul className="flex flex-col gap-3">
                    {tools
                      .filter((t) => t.group === g)
                      .map((t) => (
                        <li key={t.name} className="flex flex-col">
                          <span className="text-silver">{t.name}</span>
                          <span className="text-sm text-muted">{t.usedFor}</span>
                        </li>
                      ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
