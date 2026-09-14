import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const optionalMoney = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}, z.coerce.number().min(0).optional());

export const productSchema = z
  .object({
    nameEn: z.string().trim().min(1).max(200),
    nameAr: z.string().trim().min(1).max(200),
    slug: z.string().trim().min(1).max(200).regex(slugPattern, {
      message: "slug_format",
    }),
    descriptionEn: z.string().trim().max(5000).optional().or(z.literal("")),
    descriptionAr: z.string().trim().max(5000).optional().or(z.literal("")),
    categoryId: z.string().uuid().optional().or(z.literal("")),
    retailPrice: z.coerce.number().min(0),
    originalPrice: optionalMoney,
    wholesalePrice: optionalMoney,
    cost: z.coerce.number().min(0),
    stockQuantity: z.coerce.number().int().min(0),
    lowStockThreshold: z.coerce.number().int().min(0).default(5),
    dimensions: z.string().trim().max(200).optional().or(z.literal("")),
    material: z.string().trim().max(200).optional().or(z.literal("")),
    color: z.string().trim().max(100).optional().or(z.literal("")),
    packageContentsEn: z.string().trim().max(2000).optional().or(z.literal("")),
    packageContentsAr: z.string().trim().max(2000).optional().or(z.literal("")),
    videoUrl: z.string().trim().url().optional().or(z.literal("")),
    isPublished: z.coerce.boolean().default(false),
  })
  .refine(
    (data) => !data.originalPrice || data.originalPrice > data.retailPrice,
    { message: "original_price_too_low", path: ["originalPrice"] },
  );

export type ProductInput = z.infer<typeof productSchema>;
