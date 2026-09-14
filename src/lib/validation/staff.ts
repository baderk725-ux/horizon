import { z } from "zod";

export const STAFF_ROLES = ["super_admin", "manager", "sales", "warehouse"] as const;

export const staffRoleSchema = z.object({
  staffRole: z.enum(STAFF_ROLES),
});
