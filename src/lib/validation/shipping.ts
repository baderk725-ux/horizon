import { z } from "zod";

export const governorateSchema = z.object({
  nameEn: z.string().trim().min(1).max(120),
  nameAr: z.string().trim().min(1).max(120),
});

export const deliveryAreaSchema = z.object({
  governorateId: z.string().uuid({ message: "governorate_required" }),
  nameEn: z.string().trim().min(1).max(120),
  nameAr: z.string().trim().min(1).max(120),
  deliveryFee: z.coerce.number().min(0),
  freeDeliveryThreshold: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.coerce.number().min(0).optional()),
  isActive: z.coerce.boolean().default(true),
  isConfigured: z.coerce.boolean().default(true),
});

export type GovernorateInput = z.infer<typeof governorateSchema>;
export type DeliveryAreaInput = z.infer<typeof deliveryAreaSchema>;
