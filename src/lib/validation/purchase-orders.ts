import { z } from "zod";

export const purchaseOrderSchema = z.object({
  supplierId: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    return value.trim() === "" ? undefined : value;
  }, z.string().uuid().optional()),
  notes: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(1000).optional()),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.coerce.number().int().positive(),
        unitCost: z.coerce.number().min(0),
      }),
    )
    .min(1, { message: "at_least_one_item" }),
});

export type PurchaseOrderInput = z.infer<typeof purchaseOrderSchema>;
