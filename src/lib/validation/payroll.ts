import { z } from "zod";

export const salarySchema = z.object({
  monthlySalary: z.coerce.number().min(0),
  notes: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(500).optional()),
});

export const payrollPaymentSchema = z.object({
  amount: z.coerce.number().positive(),
  period: z.string().trim().min(1).max(30),
  paymentDate: z.string().min(1),
  notes: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(500).optional()),
});
