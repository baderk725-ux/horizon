import { z } from "zod";

const jordanPhone = /^(\+?962|0)?7[789]\d{7}$/;

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(jordanPhone, { message: "invalid_phone" }),
  email: z.string().trim().email().optional().or(z.literal("")),
  governorateId: z.string().uuid({ message: "governorate_required" }),
  areaId: z.string().uuid({ message: "area_required" }),
  fullAddress: z.string().trim().min(5).max(500),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  termsAccepted: z
    .string()
    .refine((v) => v === "on", { message: "terms_required" }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
