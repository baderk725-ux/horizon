import { z } from "zod";

const optionalString = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}, z.string().max(200).optional());

export const storeSettingsSchema = z.object({
  supportEmail: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().email().optional()),
  supportPhone: optionalString,
  whatsappNumber: optionalString,
  instagramUrl: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().url().optional()),
  facebookUrl: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().url().optional()),
  tiktokUrl: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().url().optional()),
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
