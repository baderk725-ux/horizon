import type { Project } from "@/content/projects";

/**
 * Placeholder key art per concept, drawn in SVG from each project's colour field.
 * Replaced by real captures of the showcase builds in Phase 5.
 */
export function ProjectArt({ project }: { project: Project }) {
  const [a, b] = project.field;
  const id = `g-${project.slug}`;
  return (
    <svg viewBox="0 0 800 500" className="size-full" role="img" aria-label={`${project.name} key art (placeholder)`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#${id})`} />
      {project.slug === "aurex" &&
        [0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={150 + i * 104} y={330 - i * 40} width="70" height={170 + i * 40} fill={project.accent} opacity={0.08 + i * 0.06} />
        ))}
      {project.slug === "nova" && (
        <g>
          <rect x="40" y="40" width="170" height="420" fill={project.accent} opacity="0.07" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={240 + i * 180} y="40" width="160" height="90" fill={project.accent} opacity="0.08" />
          ))}
          <path d="M240 380 C 330 330, 400 360, 480 290 S 640 200, 760 170" stroke={project.accent} strokeWidth="3" fill="none" />
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={244 + i * 37} y={460 - (30 + ((i * 37) % 70))} width="20" height={30 + ((i * 37) % 70)} fill={project.accent} opacity="0.25" />
          ))}
        </g>
      )}
      {project.slug === "orbit" && (
        <g>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ellipse key={i} cx="500" cy="250" rx={i * 46} ry={i * 30} transform="rotate(-17 500 250)" fill="none" stroke={project.accent} strokeOpacity="0.45" />
          ))}
          <circle cx="500" cy="250" r="12" fill={project.accent} />
          {[[50, 70, 260], [50, 140, 210], [90, 210, 230]].map(([x, y, w], i) => (
            <rect key={i} x={x} y={y} width={w} height="50" rx="18" fill="#E7EAF0" opacity="0.08" />
          ))}
        </g>
      )}
      {project.slug === "vanta" && (
        <g>
          <rect x="352" y="110" width="96" height="50" rx="6" fill="#E7EAF0" opacity="0.85" />
          <rect x="288" y="160" width="224" height="250" rx="30" fill={project.accent} opacity="0.75" />
        </g>
      )}
      <text x="40" y="470" fill="#E7EAF0" fillOpacity="0.5" fontFamily="var(--font-mono)" fontSize="14" letterSpacing="1.5">
        PLACEHOLDER ART · CAPTURE IN PRODUCTION
      </text>
    </svg>
  );
}
