import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/, { message: "invalid_code" })
    .transform((v) => v.toUpperCase()),
  discountType: z.enum(["percent", "fixed"]),
  value: z.coerce.number().positive(),
  minOrderAmount: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.coerce.number().min(0).optional()),
  maxUses: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.coerce.number().int().positive().optional()),
  expiresAt: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().optional()),
  isActive: z.coerce.boolean().default(true),
});

export type CouponInput = z.infer<typeof couponSchema>;
