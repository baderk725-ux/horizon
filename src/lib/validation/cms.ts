import { z } from "zod";

const optionalText = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}, z.string().max(2000).optional());

export const siteContentEntrySchema = z.object({
  key: z.string().min(1),
  valueEn: optionalText,
  valueAr: optionalText,
});

export const faqSchema = z.object({
  questionEn: z.string().trim().min(1).max(300),
  questionAr: z.string().trim().min(1).max(300),
  answerEn: z.string().trim().min(1).max(2000),
  answerAr: z.string().trim().min(1).max(2000),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.preprocess((value) => value === "on" || value === "true" || value === true, z.boolean()),
});

export type FaqInput = z.infer<typeof faqSchema>;
