/**
 * Canonical site facts. Only facts Khaled has provided are filled in;
 * everything else is `null` and the UI hides it until it is supplied.
 */
export const site = {
  name: "Khaled",
  title: "Khaled — Premium websites, cinematic experiences & AI applications",
  description:
    "Khaled designs and builds premium websites, cinematic digital experiences and AI-powered applications for ambitious brands and founders.",
  concept: "Beyond the interface",
  role: "Creative developer · Web designer · AI builder",
  offer:
    "Premium websites, cinematic digital experiences and AI-powered applications, designed and built for ambitious brands and founders.",
  services: ["Premium websites", "Cinematic experiences", "AI applications"] as const,
  experience: { webYears: 5, aiYears: 2 },
  /** TODO(Khaled): production URL once a domain is chosen. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** TODO(Khaled): contact email. Hidden in the UI while null. */
  email: (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null) as string | null,
  /** TODO(Khaled): availability line. Hidden while null. */
  availability: null as string | null,
  /** TODO(Khaled): profile URLs. Empty entries are not rendered. */
  socials: [] as { label: string; href: string }[],
  /** Promise shown after an inquiry is sent. TODO(Khaled): confirm. */
  responseTime: "I reply to every inquiry personally.",
} as const;

export const chapters = [
  { id: "signal", label: "Signal" },
  { id: "form", label: "Form" },
  { id: "interface", label: "Interface" },
  { id: "work", label: "Work" },
  { id: "system", label: "System" },
  { id: "beyond", label: "Beyond" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];
