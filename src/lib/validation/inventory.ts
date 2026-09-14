import { z } from "zod";

export const stockAdjustSchema = z.object({
  stockQuantity: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0),
});

export type StockAdjustInput = z.infer<typeof stockAdjustSchema>;
