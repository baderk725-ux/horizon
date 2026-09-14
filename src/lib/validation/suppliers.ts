import { z } from "zod";

const optionalString = (max: number) =>
  z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(max).optional());

export const supplierSchema = z.object({
  name: z.string().trim().min(1).max(160),
  contactPerson: optionalString(160),
  phone: optionalString(30),
  email: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().email().optional()),
  address: optionalString(500),
  notes: optionalString(1000),
});

export type SupplierInput = z.infer<typeof supplierSchema>;
