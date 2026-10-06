// ─── Category ───────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
}

// ─── Product ─────────────────────────────────────────────────────────────────
export type PricingType = "fixed" | "quote";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  image?: string;
  pricingType: PricingType;
  basePrice?: number;          // KES — for fixed-price products
  priceUnit?: string;          // e.g. "per 100 pieces"
  isSameDay: boolean;
  isPopular: boolean;
  isNew: boolean;
  turnaround: string;          // e.g. "1–2 business days"
  variants?: ProductVariant[];
  stockStatus?: StockStatus;   // Overridden by admin via product_status table
}

export interface ProductVariant {
  name: string;   // e.g. "Glossy", "Matte"
  priceModifier: number; // KES added to base price
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
  designFile?: string;         // URL after upload
  notes?: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "printing"
  | "ready"
  | "delivered";

export interface Order {
  id: string;
  items: CartItem[];
  customer: Customer;
  status: OrderStatus;
  totalKES: number;
  createdAt: string;
  deliveryMethod: "pickup" | "delivery";
  deliveryAddress?: string;
}

// ─── Quote ───────────────────────────────────────────────────────────────────
export type QuoteStatus = "pending" | "sent" | "accepted" | "declined";

export interface QuoteRequest {
  id: string;
  productName: string;
  quantity: number;
  description: string;
  designFile?: string;
  customer: Customer;
  status: QuoteStatus;
  createdAt: string;
}

// ─── Customer ────────────────────────────────────────────────────────────────
export interface Customer {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

// ─── Bundle ──────────────────────────────────────────────────────────────────
export interface Bundle {
  id: string;
  name: string;
  tagline: string;
  targetAudience: string;
  items: string[];
  priceKES: number;
  originalPriceKES: number;
  isPopular?: boolean;
}

