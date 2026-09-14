import { z } from "zod";

export const bundleSchema = z.object({
  nameEn: z.string().trim().min(1).max(160),
  nameAr: z.string().trim().min(1).max(160),
  descriptionEn: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(1000).optional()),
  descriptionAr: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(1000).optional()),
  bundlePrice: z.coerce.number().positive(),
  isActive: z.coerce.boolean().default(true),
  products: z
    .array(z.object({ productId: z.string().uuid(), quantity: z.coerce.number().int().positive() }))
    .min(2, { message: "at_least_two_products" }),
});

export type BundleInput = z.infer<typeof bundleSchema>;
