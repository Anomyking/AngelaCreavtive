import { ObjectId, type Filter, type Document, type WithId } from "mongodb";
import { getDb } from "@/lib/mongodb";
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Documents are stored with a Mongo ObjectId `_id` and real Date timestamps.
// Everything the rest of the app sees is plain JSON-safe data: `id` is the
// _id as a hex string and the timestamps are ISO strings — the same shape the
// admin pages and API routes already expect.

function serialize<T>(doc: WithId<Document>): T {
  const { _id, created_at, updated_at, ...rest } = doc;
  return {
    ...rest,
    id:         _id.toHexString(),
    created_at: created_at instanceof Date ? created_at.toISOString() : String(created_at),
    updated_at: updated_at instanceof Date ? updated_at.toISOString() : String(updated_at),
  } as T;
}

/** Turns an id from a URL into an ObjectId; throws "Not found" for malformed ids. */
function toObjectId(id: string): ObjectId {
  if (!ObjectId.isValid(id) || String(new ObjectId(id)) !== id.toLowerCase()) {
    throw new Error("Not found");
  }
  return new ObjectId(id);
}

/** Drops keys whose value is undefined so $set never wipes a field by accident. */
function defined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

function mustFind<T>(doc: WithId<Document> | null): T {
  if (!doc) throw new Error("Not found");
  return serialize<T>(doc);
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
  const db  = await getDb();
  const now = new Date();
  const doc = {
    ...defined(data),
    payment_status: "pending",
    status:         "pending",
    created_at:     now,
    updated_at:     now,
  };
  // The unique index on `reference` makes a duplicate reference fail loudly.
  const { insertedId } = await db.collection("orders").insertOne(doc);
  return serialize<DBOrder>({ _id: insertedId, ...doc });
}

export async function getOrders(options?: {
  status?: OrderStatus;
  limit?:  number;
  offset?: number;
}) {
  const db     = await getDb();
  const filter: Filter<Document> = options?.status ? { status: options.status } : {};
  let cursor   = db.collection("orders").find(filter).sort({ created_at: -1 });

  if (options?.offset) cursor = cursor.skip(options.offset);
  if (options?.limit)  cursor = cursor.limit(options.limit);

  const docs = await cursor.toArray();
  return docs.map((d) => serialize<DBOrder>(d));
}

export async function getOrderByReference(reference: string) {
  const db = await getDb();
  return mustFind<DBOrder>(await db.collection("orders").findOne({ reference }));
}

export async function getOrderById(id: string) {
  const db = await getDb();
  return mustFind<DBOrder>(await db.collection("orders").findOne({ _id: toObjectId(id) }));
}

export async function updateOrderStatus(
  reference: string,
  status:    OrderStatus,
  extras?:   { tracking_code?: string; notes?: string }
) {
  const db  = await getDb();
  const doc = await db.collection("orders").findOneAndUpdate(
    { reference },
    { $set: { ...defined({ status, ...extras }), updated_at: new Date() } },
    { returnDocument: "after" }
  );
  return mustFind<DBOrder>(doc);
}

export type PaymentStatus = DBOrder["payment_status"];

/** Admin records that payment was received (or refunded etc.) outside the site. */
export async function setOrderPaymentStatus(reference: string, payment_status: PaymentStatus) {
  const db  = await getDb();
  const doc = await db.collection("orders").findOneAndUpdate(
    { reference },
    { $set: { payment_status, updated_at: new Date() } },
    { returnDocument: "after" }
  );
  return mustFind<DBOrder>(doc);
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
  const db  = await getDb();
  const now = new Date();
  const doc = { ...defined(data), status: "pending", created_at: now, updated_at: now };
  const { insertedId } = await db.collection("quotes").insertOne(doc);
  return serialize<DBQuote>({ _id: insertedId, ...doc });
}

export async function getQuotes(options?: {
  status?: QuoteStatus;
  limit?:  number;
}) {
  const db     = await getDb();
  const filter: Filter<Document> = options?.status ? { status: options.status } : {};
  let cursor   = db.collection("quotes").find(filter).sort({ created_at: -1 });
  if (options?.limit) cursor = cursor.limit(options.limit);

  const docs = await cursor.toArray();
  return docs.map((d) => serialize<DBQuote>(d));
}

export async function getQuoteById(id: string) {
  const db = await getDb();
  return mustFind<DBQuote>(await db.collection("quotes").findOne({ _id: toObjectId(id) }));
}

export async function updateQuote(
  id:     string,
  update: { status?: QuoteStatus; quoted_amount?: number; admin_notes?: string }
) {
  const db  = await getDb();
  const doc = await db.collection("quotes").findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: { ...defined(update), updated_at: new Date() } },
    { returnDocument: "after" }
  );
  return mustFind<DBQuote>(doc);
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await getDb();

  const now          = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  // One pass over the orders collection — same numbers the old `order_stats` SQL view produced.
  const [row] = await db.collection("orders").aggregate([
    {
      $group: {
        _id:           null,
        total_orders:  { $sum: 1 },
        pending:       { $sum: { $cond: [{ $eq: ["$status", "pending"] },   1, 0] } },
        confirmed:     { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
        printing:      { $sum: { $cond: [{ $eq: ["$status", "printing"] },  1, 0] } },
        ready:         { $sum: { $cond: [{ $eq: ["$status", "ready"] },     1, 0] } },
        delivered:     { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
        total_revenue: {
          $sum: { $cond: [{ $eq: ["$payment_status", "paid"] }, "$total", 0] },
        },
        revenue_this_month: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ["$payment_status", "paid"] }, { $gte: ["$created_at", startOfMonth] }] },
              "$total",
              0,
            ],
          },
        },
      },
    },
    { $project: { _id: 0 } },
  ]).toArray();

  return (row as DashboardStats | undefined) ?? {
    total_orders: 0, pending: 0, confirmed: 0, printing: 0, ready: 0, delivered: 0,
    total_revenue: 0, revenue_this_month: 0,
  };
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

function serializeProductStatus(doc: WithId<Document>): DBProductStatus {
  const { _id, updated_at, ...rest } = doc;
  void _id;
  return {
    ...rest,
    updated_at: updated_at instanceof Date ? updated_at.toISOString() : String(updated_at),
  } as DBProductStatus;
}

export async function getAllProductStatuses(): Promise<DBProductStatus[]> {
  try {
    const db   = await getDb();
    const docs = await db.collection("product_status").find({}).toArray();
    return docs.map(serializeProductStatus);
  } catch {
    // The storefront must keep working (with default stock) even if the DB is unreachable
    return [];
  }
}

export async function upsertProductStatus(update: {
  product_id:     string;
  stock_status?:  StockStatus;
  override_price?: number | null;
  is_hidden?:     boolean;
  admin_note?:    string | null;
}) {
  const db = await getDb();
  const { product_id, ...changes } = defined(update) as typeof update;

  // Fields the admin didn't send keep their current value, or get the defaults on first insert.
  const defaults: Record<string, unknown> = {
    stock_status: "in_stock", override_price: null, is_hidden: false, admin_note: null,
  };
  const onInsert = Object.fromEntries(Object.entries(defaults).filter(([k]) => !(k in changes)));

  const doc = await db.collection("product_status").findOneAndUpdate(
    { product_id },
    {
      $set:         { ...changes, updated_at: new Date() },
      $setOnInsert: { product_id, ...onInsert },
    },
    { upsert: true, returnDocument: "after" }
  );
  if (!doc) throw new Error("Could not save product status");
  return serializeProductStatus(doc);
}

// Recent revenue trend (last 30 days) — for dashboard chart
export async function getRevenueTrend(days = 14) {
  try {
    const db    = await getDb();
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const rows  = await db.collection("orders")
      .find({ created_at: { $gte: since }, payment_status: "paid" })
      .project({ created_at: 1, total: 1 })
      .toArray();

    // Bucket by day
    const byDay: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      byDay[d.toISOString().slice(0, 10)] = 0;
    }
    for (const row of rows) {
      const key = (row.created_at as Date).toISOString().slice(0, 10);
      if (key in byDay) byDay[key] += row.total ?? 0;
    }
    return Object.entries(byDay).map(([date, total]) => ({ date, total }));
  } catch {
    return [];
  }
}
