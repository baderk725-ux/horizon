import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(1000).optional()),
});
