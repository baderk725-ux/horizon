import { z } from "zod";

/** Edit these lists to change the Start a Project options. */
export const projectTypes = [
  "Premium website",
  "Cinematic / interactive experience",
  "AI-powered application",
  "Web design & UI/UX",
  "Something else",
] as const;

export const budgets = ["Under $3k", "$3k–$7k", "$7k–$15k", "$15k–$30k", "$30k+", "Not sure yet"] as const;

export const timelines = ["As soon as possible", "1–2 months", "3–6 months", "Flexible"] as const;

export const contactMethods = ["Email", "Video call"] as const;

export const inquirySchema = z.object({
  projectTypes: z.array(z.enum(projectTypes)).min(1, "Choose at least one project type."),
  budget: z.enum(budgets, { error: "Choose a budget range." }),
  timeline: z.enum(timelines).optional(),
  description: z
    .string()
    .trim()
    .min(20, "Tell me a little more — at least 20 characters.")
    .max(4000, "Please keep it under 4,000 characters."),
  links: z.string().trim().max(500).optional().default(""),
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.email("Please enter a valid email address.").max(200),
  company: z.string().trim().max(160).optional().default(""),
  contactMethod: z.enum(contactMethods).default("Email"),
  /** Honeypot — must stay empty */
  website: z.string().max(0).optional().default(""),
});

export type Inquiry = z.infer<typeof inquirySchema>;
