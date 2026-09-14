import { z } from "zod";

export const collectionSchema = z.object({
  nameEn: z.string().trim().min(1).max(160),
  nameAr: z.string().trim().min(1).max(160),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9-]+$/, { message: "invalid_slug" }),
  placement: z.enum(["home", "shop_top", "hidden"]),
  cardSize: z.enum(["normal", "large"]),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.coerce.boolean().default(true),
  productIds: z.array(z.string().uuid()),
});

export type CollectionInput = z.infer<typeof collectionSchema>;
