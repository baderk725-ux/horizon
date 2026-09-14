import { z } from "zod";

const jordanPhone = /^(\+?962|0)?7[789]\d{7}$/;

export const manualOrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1).max(9999),
});

export const manualOrderSchema = z.object({
  manualCustomerId: z.string().uuid().optional().or(z.literal("")),
  saveAsNewCustomer: z.coerce.boolean().default(false),
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(jordanPhone, { message: "invalid_phone" }),
  email: z.string().trim().email().optional().or(z.literal("")),
  governorateId: z.string().uuid({ message: "governorate_required" }),
  areaId: z.string().uuid({ message: "area_required" }),
  fullAddress: z.string().trim().min(5).max(500),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  internalNotes: z.string().trim().max(1000).optional().or(z.literal("")),
  items: z
    .string()
    .transform((raw, ctx) => {
      try {
        const parsed = JSON.parse(raw);
        return z.array(manualOrderItemSchema).min(1).parse(parsed);
      } catch {
        ctx.addIssue({ code: "custom", message: "items_required" });
        return z.NEVER;
      }
    }),
});

export type ManualOrderInput = z.infer<typeof manualOrderSchema>;
