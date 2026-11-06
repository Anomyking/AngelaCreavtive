import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";
import { isRateLimited, getClientIp } from "@/lib/admin-auth";

// Orders are placed without online payment. Our team confirms each order and
// arranges payment with the customer (WhatsApp / phone / email). The admin
// dashboard then marks the order as paid.
//
// payment_method is stored as "whatsapp" because that value is already allowed
// by the orders table check constraint (see supabase-schema.sql) — it means
// "payment arranged offline", so no database migration is required.
const OFFLINE_PAYMENT_METHOD = "whatsapp";

function generateRef(): string {
  return `PTL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

type CheckoutItem = { product: { name: string }; quantity: number; unitPrice: number };

export async function POST(req: NextRequest) {
  // 20 order attempts per hour per IP
  if (isRateLimited(getClientIp(req), 20, 60 * 60 * 1000)) {
    return NextResponse.json({ message: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { customer, items, total, subtotal, deliveryFee, deliveryMethod } = body;

    if (!customer?.name || !customer?.email || !customer?.phone || !items?.length || !total) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const reference = generateRef();
    const amountKES = Math.round(total);

    // ── Save the order ─────────────────────────────────────────────────────
    const order = await createOrder({
      reference,
      customer_name:    customer.name,
      customer_email:   customer.email,
      customer_phone:   customer.phone,
      items,
      subtotal:         Math.round(subtotal ?? amountKES),
      delivery_fee:     Math.round(deliveryFee ?? 0),
      total:            amountKES,
      payment_method:   OFFLINE_PAYMENT_METHOD,
      delivery_method:  deliveryMethod ?? "nairobi",
      delivery_address: customer.address ?? undefined,
    });

    // ── Confirmation email (customer + admin copy) ─────────────────────────
    // sendOrderConfirmation never throws, so an email problem can't lose the order.
    await sendOrderConfirmation({
      reference:       order.reference,
      customerName:    order.customer_name,
      customerEmail:   order.customer_email,
      customerPhone:   order.customer_phone,
      items:           (order.items as CheckoutItem[]).map((i) => ({
        name:     i.product.name,
        quantity: i.quantity,
        price:    Math.round(i.unitPrice * (i.quantity / 100)),
      })),
      subtotal:        order.subtotal,
      deliveryFee:     order.delivery_fee,
      total:           order.total,
      deliveryMethod:  order.delivery_method,
      deliveryAddress: order.delivery_address,
    });

    return NextResponse.json({ success: true, reference });

  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ message: "Server error. Please try again." }, { status: 500 });
  }
}
