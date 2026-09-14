import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categorySchema = z.object({
  nameEn: z.string().trim().min(1).max(120),
  nameAr: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(160).regex(slugPattern, {
    message: "slug_format",
  }),
  parentId: z.string().uuid().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export type CategoryInput = z.infer<typeof categorySchema>;
