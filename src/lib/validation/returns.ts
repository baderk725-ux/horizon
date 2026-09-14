import { z } from "zod";

export const RETURN_REASONS = [
  "changed_mind",
  "differs_from_description",
  "size_unsuitable",
  "damaged",
  "wrong_order",
  "not_received",
  "other",
] as const;

export const createReturnSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.enum(RETURN_REASONS),
  reasonNotes: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(1000).optional()),
});

export type CreateReturnInput = z.infer<typeof createReturnSchema>;
