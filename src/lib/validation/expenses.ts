import { z } from "zod";

export const expenseSchema = z.object({
  category: z.string().trim().min(1).max(100),
  description: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(500).optional()),
  amount: z.coerce.number().positive(),
  expenseDate: z.string().min(1),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
