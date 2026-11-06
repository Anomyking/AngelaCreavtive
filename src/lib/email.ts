import { Resend } from "resend";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmation";
import { QuoteReceivedEmail }     from "@/emails/QuoteReceived";
import { QuoteRequestAdminEmail } from "@/emails/QuoteRequestAdmin";
import { DeliveryUpdateEmail }    from "@/emails/DeliveryUpdate";

// ─── Resend client ────────────────────────────────────────────────────────────
// Add RESEND_API_KEY to .env.local
// Sign up free at resend.com — 3,000 emails/month on free tier
// Client is created per-request so build does not fail without the key

const FROM_EMAIL  = "Angela <orders@angela.co.ke>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "hello@angela.co.ke";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface OrderEmailData {
  reference:      string;
  customerName:   string;
  customerEmail:  string;
  customerPhone:  string;
  items:          Array<{ name: string; quantity: number; price: number }>;
  subtotal:       number;
  deliveryFee:    number;
  total:          number;
  deliveryMethod: string;
  deliveryAddress?: string;
}

export interface QuoteEmailData {
  customerName:    string;
  customerEmail:   string;
  customerPhone:   string;
  company?:        string;
  productName:     string;
  quantity:        string;
  description:     string;
  timeline?:       string;
  designFileName?: string;
}

export interface DeliveryEmailData {
  reference:     string;
  customerName:  string;
  customerEmail: string;
  status:        "printing" | "ready" | "dispatched" | "delivered";
  trackingCode?: string;
  message?:      string;
}

// ─── 1. Order confirmation → customer ─────────────────────────────────────────
export async function sendOrderConfirmation(data: OrderEmailData) {
  try {
    const { error } = await getResend().emails.send({
      from:    FROM_EMAIL,
      to:      data.customerEmail,
      subject: `Order received ✅ — ${data.reference} | Angela`,
      react:   OrderConfirmationEmail(data),
    });

    if (error) throw error;

    // Also notify admin
    await getResend().emails.send({
      from:    FROM_EMAIL,
      to:      ADMIN_EMAIL,
      subject: `🛒 New order: ${data.reference} — KES ${data.total.toLocaleString()}`,
      react:   OrderConfirmationEmail({ ...data, isAdminCopy: true }),
    });

    return { success: true };
  } catch (err) {
    console.error("sendOrderConfirmation error:", err);
    return { success: false, error: err };
  }
}

// ─── 2. Quote received → customer ─────────────────────────────────────────────
export async function sendQuoteReceivedEmail(data: QuoteEmailData) {
  try {
    // Email to customer — acknowledgment
    const { error } = await getResend().emails.send({
      from:    FROM_EMAIL,
      to:      data.customerEmail,
      subject: `We received your quote request — Angela`,
      react:   QuoteReceivedEmail(data),
    });

    if (error) throw error;

    // Email to admin — full details to action
    await getResend().emails.send({
      from:    FROM_EMAIL,
      to:      ADMIN_EMAIL,
      subject: `📋 New quote request: ${data.productName} — ${data.customerName}`,
      react:   QuoteRequestAdminEmail(data),
    });

    return { success: true };
  } catch (err) {
    console.error("sendQuoteReceivedEmail error:", err);
    return { success: false, error: err };
  }
}

// ─── 3. Delivery / status update → customer ────────────────────────────────
export async function sendDeliveryUpdate(data: DeliveryEmailData) {
  const subjects: Record<DeliveryEmailData["status"], string> = {
    printing:   `Your order is being printed 🖨️ — ${data.reference}`,
    ready:      `Your order is ready for collection 🎉 — ${data.reference}`,
    dispatched: `Your order is on its way 🚚 — ${data.reference}`,
    delivered:  `Your order has been delivered ✅ — ${data.reference}`,
  };

  try {
    const { error } = await getResend().emails.send({
      from:    FROM_EMAIL,
      to:      data.customerEmail,
      subject: subjects[data.status],
      react:   DeliveryUpdateEmail(data),
    });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("sendDeliveryUpdate error:", err);
    return { success: false, error: err };
  }
}
// ─── Internal: get client lazily ─────────────────────────────────────────────
function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set in .env.local");
  return new Resend(key);
}

