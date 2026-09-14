import { z } from "zod";

export const wholesaleApplicationSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  companyName: z.string().trim().min(1).max(160),
  phone: z.string().trim().min(1).max(30),
  email: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().email().optional()),
  governorateId: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    return value.trim() === "" ? undefined : value;
  }, z.string().uuid().optional()),
  areaText: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(200).optional()),
  address: z.string().trim().min(1).max(500),
  commercialRegistrationNumber: z.string().trim().min(1).max(60),
  notes: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(1000).optional()),
});

export type WholesaleApplicationInput = z.infer<typeof wholesaleApplicationSchema>;
