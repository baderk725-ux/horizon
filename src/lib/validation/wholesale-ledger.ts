import { z } from "zod";

export const chargeSchema = z.object({
  description: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(300).optional()),
  amount: z.coerce.number().positive(),
  dueDate: z.string().min(1),
});

export const paymentSchema = z.object({
  chargeId: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    return value.trim() === "" ? undefined : value;
  }, z.string().uuid().optional()),
  amount: z.coerce.number().positive(),
  method: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(60).optional()),
  notes: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(500).optional()),
});
