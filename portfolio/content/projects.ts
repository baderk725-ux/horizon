/**
 * The four self-initiated concept projects. These are NOT client work:
 * every surface that shows them must render `conceptLabel`.
 * No clients, metrics or results are claimed.
 */
export const conceptLabel = "Independent concept — not a client project";

export interface Project {
  slug: string;
  index: string;
  name: string;
  kind: string;
  summary: string;
  /** Per-project colour field (art direction §4) */
  accent: string;
  field: [string, string];
  year: number;
  role: string[];
  stack: string[];
  brief: string;
  approach: string;
  decisions: { title: string; body: string }[];
  /** What the showcase demo will let visitors do (built in Phase 5) */
  demo: { title: string; body: string };
}

export const projects: Project[] = [
  {
    slug: "aurex",
    index: "01",
    name: "Aurex",
    kind: "Creative digital studio",
    summary: "A premium agency website concept built around cinematic visuals, GSAP choreography and interactive 3D.",
    accent: "#C9CDD6",
    field: ["#16181D", "#2B2F37"],
    year: 2026,
    role: ["Art direction", "Web design", "Creative development"],
    stack: ["Next.js", "GSAP", "Three.js", "Tailwind CSS"],
    brief:
      "A self-initiated brief: design a studio site that sells taste before it sells services, where the work is the first thing you feel.",
    approach:
      "A monochrome stone palette lets the work carry all the colour. Motion is slow and architectural: masks, monolith-like reveals and one interactive 3D object as the studio's signature.",
    decisions: [
      { title: "Silence as luxury", body: "Generous negative space and a single typeface at extreme sizes, so every project feels like an exhibition piece." },
      { title: "One 3D object, not a 3D site", body: "A single interactive sculpture anchors the hero; everything else stays fast, readable DOM." },
      { title: "Choreographed case-study entries", body: "Each project opens with a timed sequence: mask, scale, caption. Built as reusable GSAP timelines." },
    ],
    demo: { title: "Interactive motion piece", body: "A live hero sculpture and reveal sequence you can scrub and interact with." },
  },
  {
    slug: "nova",
    index: "02",
    name: "Nova",
    kind: "SaaS platform",
    summary: "A functional SaaS dashboard concept: data components, interactive charts and a responsive architecture.",
    accent: "#9FB7E8",
    field: ["#0E1420", "#1D2A3F"],
    year: 2026,
    role: ["Product design", "UI system", "Frontend development"],
    stack: ["Next.js", "TypeScript", "D3 scales", "Tailwind CSS"],
    brief:
      "A self-initiated brief: a dashboard that stays calm with a lot of data, works on a phone and feels as considered as a marketing site.",
    approach:
      "A component-first UI system with a cool steel palette, dense but legible data views and charts drawn as custom SVG for full control over motion and accessibility.",
    decisions: [
      { title: "Charts that explain themselves", body: "Every chart has a keyboard-accessible data table and plain-language summary." },
      { title: "Responsive by layout, not by hiding", body: "Panels reflow into a single column with priority ordering instead of collapsing into menus." },
      { title: "Composable components", body: "Cards, filters and charts compose from small primitives so new views take hours, not days." },
    ],
    demo: { title: "Live dashboard module", body: "An interactive chart and KPI module with filters, running on deterministic demo data." },
  },
  {
    slug: "orbit",
    index: "03",
    name: "Orbit",
    kind: "AI-powered application",
    summary: "An AI assistant concept with a modern conversational UI and intelligent, multi-step workflows.",
    accent: "#B8F34A",
    field: ["#0B0D10", "#1A2210"],
    year: 2026,
    role: ["AI product design", "Conversational UI", "Full-stack development"],
    stack: ["Next.js", "Claude API", "Streaming", "TypeScript"],
    brief:
      "A self-initiated brief: an assistant that shows its work. Users should see what it is doing, steer it and trust the result.",
    approach:
      "A conversational interface with visible workflow steps, streaming responses and clear states for thinking, acting and done. Claude powers it server-side when configured.",
    decisions: [
      { title: "Show the workflow", body: "Multi-step tasks render as a live checklist so users can follow and interrupt the assistant." },
      { title: "Server-side intelligence", body: "API keys never reach the browser; a streaming route handler keeps responses fast." },
      { title: "Honest demo mode", body: "Without an API key, a clearly labelled demo mode plays scripted conversations." },
    ],
    demo: { title: "Assistant demo", body: "Try the conversational UI. Live Claude responses when configured, a labelled demo mode otherwise." },
  },
  {
    slug: "vanta",
    index: "04",
    name: "Vanta",
    kind: "Premium e-commerce",
    summary: "A luxury e-commerce concept: collections, product detail, an interactive product presentation and a shopping bag.",
    accent: "#D9CDB8",
    field: ["#1C1A17", "#3A352D"],
    year: 2026,
    role: ["E-commerce UX", "Art direction", "Frontend development"],
    stack: ["Next.js", "Three.js", "TypeScript", "Tailwind CSS"],
    brief:
      "A self-initiated brief: an online store that feels like walking into a flagship boutique, without slowing down the path to purchase.",
    approach:
      "Warm bone and charcoal tones, editorial product photography layouts and an interactive product viewer, with a shopping flow that stays fast and frictionless.",
    decisions: [
      { title: "Editorial collections", body: "Collections read like a lookbook, with product cards that stay one tap from the bag." },
      { title: "Product as an object", body: "An interactive viewer lets customers turn and inspect the product before buying." },
      { title: "Frictionless bag", body: "The bag is a persistent side panel. Adding an item never navigates away from the product." },
    ],
    demo: { title: "Product viewer + bag", body: "Inspect a concept product and use a working shopping bag. Concept only, nothing is for sale." },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
