/**
 * TODO(Khaled): confirm this list. It is taken from the stack named in the
 * project brief; remove anything not used, add anything missing.
 */
export const toolGroups = ["Build", "Motion & 3D", "AI", "Quality"] as const;
export type ToolGroup = (typeof toolGroups)[number];

export interface Tool {
  name: string;
  group: ToolGroup;
  usedFor: string;
}

export const tools: Tool[] = [
  { name: "Next.js", group: "Build", usedFor: "Production websites and web apps" },
  { name: "React", group: "Build", usedFor: "Component-driven interfaces" },
  { name: "TypeScript", group: "Build", usedFor: "Type-safe, maintainable code" },
  { name: "Tailwind CSS", group: "Build", usedFor: "Design systems and styling" },
  { name: "GSAP", group: "Motion & 3D", usedFor: "Timelines and scroll choreography" },
  { name: "Three.js", group: "Motion & 3D", usedFor: "Real-time 3D and WebGL" },
  { name: "Framer Motion", group: "Motion & 3D", usedFor: "UI state and gesture animation" },
  { name: "Claude API", group: "AI", usedFor: "AI features and assistants" },
  { name: "Claude Code", group: "AI", usedFor: "AI-assisted development workflow" },
  { name: "Playwright", group: "Quality", usedFor: "Browser testing and QA" },
];
