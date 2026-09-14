import type { Database } from "@/lib/supabase/database.types";

export type OrderStatus = Database["public"]["Enums"]["order_status"];

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

/**
 * Mirrors validate_order_status_transition() exactly — the DB is the real
 * source of truth and will reject anything else regardless of this map;
 * this only drives which action buttons the admin UI offers, and
 * deliberately never offers "returned" (that belongs to the not-yet-built
 * Returns workflow, not a free status edit).
 */
export const NEXT_STATUSES: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  cancelled: ["confirmed"],
};
