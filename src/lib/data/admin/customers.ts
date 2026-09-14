import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { buildIlikeOrFilter } from "@/lib/supabase/search";

export type ManualCustomerRow = Database["public"]["Tables"]["manual_customers"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type AdminCustomer = {
  id: string;
  type: "registered" | "manual";
  fullName: string | null;
  phone: string | null;
  email: string | null;
  wholesaleStatus: string | null;
  createdAt: string;
};

const PAGE_SIZE = 20;

/**
 * Two real customer populations exist in this schema: signed-in accounts
 * (profiles, role='customer') and offline customers captured during manual
 * order entry (manual_customers) — there's no single backing table to page
 * through, so both are fetched (filtered by search up front to keep this
 * bounded) and merged/paginated in memory. Fine at this business's scale;
 * would need revisiting only if the customer base grew by orders of
 * magnitude.
 */
export async function getAdminCustomers(params: {
  search?: string;
  page?: number;
}): Promise<{ customers: AdminCustomer[]; total: number; page: number; pageCount: number }> {
  const supabase = await createClient();
  const page = Math.max(1, Math.floor(Number(params.page) || 1));
  const term = params.search?.trim();

  let profileQuery = supabase
    .from("profiles")
    .select("id, full_name, phone, email, wholesale_status, created_at")
    .eq("role", "customer");
  let manualQuery = supabase
    .from("manual_customers")
    .select("id, full_name, phone, email, created_at");

  if (term) {
    const filter = buildIlikeOrFilter(["full_name", "phone", "email"], term);
    profileQuery = profileQuery.or(filter);
    manualQuery = manualQuery.or(filter);
  }

  const [{ data: profiles, error: profileError }, { data: manual, error: manualError }] =
    await Promise.all([profileQuery, manualQuery]);

  if (profileError) throw profileError;
  if (manualError) throw manualError;

  const merged: AdminCustomer[] = [
    ...(profiles ?? []).map((p) => ({
      id: p.id,
      type: "registered" as const,
      fullName: p.full_name,
      phone: p.phone,
      email: p.email,
      wholesaleStatus: p.wholesale_status,
      createdAt: p.created_at,
    })),
    ...(manual ?? []).map((m) => ({
      id: m.id,
      type: "manual" as const,
      fullName: m.full_name,
      phone: m.phone,
      email: m.email,
      wholesaleStatus: null,
      createdAt: m.created_at,
    })),
  ].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const total = merged.length;
  const from = (page - 1) * PAGE_SIZE;
  const customers = merged.slice(from, from + PAGE_SIZE);

  return {
    customers,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export type AdminCustomerDetail = {
  id: string;
  type: "registered" | "manual";
  fullName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  wholesaleStatus: string | null;
  companyName: string | null;
  createdAt: string;
  orders: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
  }[];
  orderCount: number;
  lifetimeValue: number;
};

export async function getAdminCustomerById(
  id: string,
  type: "registered" | "manual",
): Promise<AdminCustomerDetail | null> {
  const supabase = await createClient();

  if (type === "registered") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, phone, email, wholesale_status, company_name, created_at")
      .eq("id", id)
      .eq("role", "customer")
      .maybeSingle();
    if (!profile) return null;

    const { data: orders } = await supabase
      .from("orders")
      .select("id, order_number, status, total, created_at")
      .eq("customer_id", id)
      .order("created_at", { ascending: false });

    const orderRows = orders ?? [];
    return {
      id: profile.id,
      type: "registered",
      fullName: profile.full_name,
      phone: profile.phone,
      email: profile.email,
      address: null,
      notes: null,
      wholesaleStatus: profile.wholesale_status,
      companyName: profile.company_name,
      createdAt: profile.created_at,
      orders: orderRows.map((o) => ({
        id: o.id,
        orderNumber: o.order_number,
        status: o.status,
        total: o.total,
        createdAt: o.created_at,
      })),
      orderCount: orderRows.length,
      lifetimeValue: orderRows
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.total, 0),
    };
  }

  const { data: customer } = await supabase
    .from("manual_customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!customer) return null;

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at")
    .eq("manual_customer_id", id)
    .order("created_at", { ascending: false });

  const orderRows = orders ?? [];
  return {
    id: customer.id,
    type: "manual",
    fullName: customer.full_name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    notes: customer.notes,
    wholesaleStatus: null,
    companyName: null,
    createdAt: customer.created_at,
    orders: orderRows.map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      status: o.status,
      total: o.total,
      createdAt: o.created_at,
    })),
    orderCount: orderRows.length,
    lifetimeValue: orderRows
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0),
  };
}
