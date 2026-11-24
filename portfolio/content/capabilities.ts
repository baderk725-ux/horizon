export interface Capability {
  index: string;
  title: string;
  body: string;
  items: string[];
}

export const capabilities: Capability[] = [
  {
    index: "01",
    title: "Web design & UI/UX",
    body: "Interfaces with a point of view: clear structure, considered typography and details that make a product feel premium.",
    items: ["Art direction", "UI/UX design", "Design systems", "Responsive design"],
  },
  {
    index: "02",
    title: "Creative development",
    body: "Production-grade frontends that move beautifully and load fast, built with modern React and Next.js.",
    items: ["Next.js & React", "TypeScript", "Performance", "Accessibility"],
  },
  {
    index: "03",
    title: "Interactive 3D & motion",
    body: "Cinematic scroll stories, real-time 3D and motion systems that make a brand impossible to forget.",
    items: ["GSAP & ScrollTrigger", "Three.js / WebGL", "Shaders", "Micro-interactions"],
  },
  {
    index: "04",
    title: "AI integration & apps",
    body: "AI-powered products and features, from assistants to intelligent workflows, designed to be useful and trustworthy.",
    items: ["Claude API", "Conversational UI", "AI workflows", "Streaming interfaces"],
  },
];
