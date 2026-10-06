import { getServerSupabase } from "@/lib/supabase-server";
import { CartItem } from "@/context/CartContext";

// ─── Types ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending" | "confirmed" | "printing"
  | "ready"   | "dispatched" | "delivered" | "cancelled";

export type QuoteStatus = "pending" | "quoted" | "accepted" | "declined";

export interface DBOrder {
  id:               string;
  reference:        string;
  customer_name:    string;
  customer_email:   string;
  customer_phone:   string;
  items:            CartItem[];
  subtotal:         number;
  delivery_fee:     number;
  total:            number;
  status:           OrderStatus;
  payment_method:   string;
  payment_status:   "pending" | "paid" | "failed" | "refunded";
  delivery_method:  string;
  delivery_address?: string;
  tracking_code?:   string;
  notes?:           string;
  created_at:       string;
  updated_at:       string;
}

export interface DBQuote {
  id:               string;
  customer_name:    string;
  customer_email:   string;
  customer_phone:   string;
  company?:         string;
  product_name:     string;
  quantity:         string;
  description:      string;
  timeline?:        string;
  design_file_name?: string;
  status:           QuoteStatus;
  quoted_amount?:   number;
  admin_notes?:     string;
  created_at:       string;
  updated_at:       string;
}

export interface DashboardStats {
  total_orders:       number;
  pending:            number;
  confirmed:          number;
  printing:           number;
  ready:              number;
  delivered:          number;
  total_revenue:      number;
  revenue_this_month: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function createOrder(data: {
  reference:       string;
  customer_name:   string;
  customer_email:  string;
  customer_phone:  string;
  items:           CartItem[];
  subtotal:        number;
  delivery_fee:    number;
  total:           number;
  payment_method:  string;
  delivery_method: string;
  delivery_address?: string;
}) {
  const db = getServerSupabase();
  const { data: order, error } = await db
    .from("orders")
    .insert([{ ...data, payment_status: "pending", status: "pending" }])
    .select()
    .single();

  if (error) throw error;
  return order as DBOrder;
}

export async function getOrders(options?: {
  status?: OrderStatus;
  limit?:  number;
  offset?: number;
}) {
  const db = getServerSupabase();
  let query = db.from("orders").select("*").order("created_at", { ascending: false });

  if (options?.status) query = query.eq("status", options.status);
  if (options?.limit)  query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, (options.offset + (options.limit ?? 20)) - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data as DBOrder[];
}

export async function getOrderByReference(reference: string) {
  const db = getServerSupabase();
  const { data, error } = await db
    .from("orders")
    .select("*")
    .eq("reference", reference)
    .single();

  if (error) throw error;
  return data as DBOrder;
}

export async function getOrderById(id: string) {
  const db = getServerSupabase();
  const { data, error } = await db
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as DBOrder;
}

export async function updateOrderStatus(
  reference: string,
  status:    OrderStatus,
  extras?:   { tracking_code?: string; notes?: string }
) {
  const db = getServerSupabase();
  const { data, error } = await db
    .from("orders")
    .update({ status, ...extras })
    .eq("reference", reference)
    .select()
    .single();

  if (error) throw error;
  return data as DBOrder;
}

export async function confirmOrderPayment(reference: string) {
  const db = getServerSupabase();
  const { data, error } = await db
    .from("orders")
    .update({ payment_status: "paid", status: "confirmed" })
    .eq("reference", reference)
    .select()
    .single();

  if (error) throw error;
  return data as DBOrder;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUOTES
// ═══════════════════════════════════════════════════════════════════════════════

export async function createQuote(data: {
  customer_name:    string;
  customer_email:   string;
  customer_phone:   string;
  company?:         string;
  product_name:     string;
  quantity:         string;
  description:      string;
  timeline?:        string;
  design_file_name?: string;
}) {
  const db = getServerSupabase();
  const { data: quote, error } = await db
    .from("quotes")
    .insert([{ ...data, status: "pending" }])
    .select()
    .single();

  if (error) throw error;
  return quote as DBQuote;
}

export async function getQuotes(options?: {
  status?: QuoteStatus;
  limit?:  number;
}) {
  const db = getServerSupabase();
  let query = db.from("quotes").select("*").order("created_at", { ascending: false });
  if (options?.status) query = query.eq("status", options.status);
  if (options?.limit)  query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data as DBQuote[];
}

export async function getQuoteById(id: string) {
  const db = getServerSupabase();
  const { data, error } = await db
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as DBQuote;
}

export async function updateQuote(
  id:     string,
  update: { status?: QuoteStatus; quoted_amount?: number; admin_notes?: string }
) {
  const db = getServerSupabase();
  const { data, error } = await db
    .from("quotes")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as DBQuote;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = getServerSupabase();
  const { data, error } = await db.from("order_stats").select("*").single();
  if (error) throw error;
  return data as DashboardStats;
}

export async function getRecentOrders(limit = 5) {
  return getOrders({ limit });
}

export async function getPendingQuotes() {
  return getQuotes({ status: "pending", limit: 10 });
}

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT STATUS (stock, hidden, price overrides)
// ═══════════════════════════════════════════════════════════════════════════
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface DBProductStatus {
  product_id:     string;
  stock_status:   StockStatus;
  override_price: number | null;
  is_hidden:      boolean;
  admin_note:     string | null;
  updated_at:     string;
}

export async function getAllProductStatuses(): Promise<DBProductStatus[]> {
  const db = getServerSupabase();
  const { data, error } = await db.from("product_status").select("*");
  if (error) return [];
  return (data ?? []) as DBProductStatus[];
}

export async function upsertProductStatus(update: {
  product_id:     string;
  stock_status?:  StockStatus;
  override_price?: number | null;
  is_hidden?:     boolean;
  admin_note?:    string | null;
}) {
  const db = getServerSupabase();
  const { data, error } = await db
    .from("product_status")
    .upsert({ ...update }, { onConflict: "product_id" })
    .select()
    .single();
  if (error) throw error;
  return data as DBProductStatus;
}

// Recent revenue trend (last 30 days) — for dashboard chart
export async function getRevenueTrend(days = 14) {
  const db = getServerSupabase();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await db
    .from("orders")
    .select("created_at, total, payment_status")
    .gte("created_at", since)
    .eq("payment_status", "paid");
  if (error) return [];

  // Bucket by day
  const byDay: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    byDay[d.toISOString().slice(0, 10)] = 0;
  }
  for (const row of data ?? []) {
    const key = (row.created_at as string).slice(0, 10);
    if (key in byDay) byDay[key] += row.total ?? 0;
  }
  return Object.entries(byDay).map(([date, total]) => ({ date, total }));
}

