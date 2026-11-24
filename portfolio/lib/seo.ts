import { site } from "@/lib/site";
import type { Project } from "@/content/projects";

/** JSON-LD builders. Serialised with `<` escaped to avoid script injection. */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

export function personLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: site.url,
    mainEntity: {
      "@type": "Person",
      name: site.name,
      jobTitle: "Creative Developer, Web Designer & AI Builder",
      description: site.description,
      url: site.url,
      knowsAbout: ["Web design", "Frontend development", "Creative development", "Three.js", "GSAP", "AI applications", "Claude API"],
      ...(site.socials.length ? { sameAs: site.socials.map((s) => s.href) } : {}),
    },
  };
}

export function creativeWorkLd(p: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${p.name} — ${p.kind}`,
    description: `${p.summary} Independent concept project, not client work.`,
    url: `${site.url}/work/${p.slug}`,
    dateCreated: String(p.year),
    creator: { "@type": "Person", name: site.name, url: site.url },
    keywords: [...p.role, ...p.stack].join(", "),
  };
}
