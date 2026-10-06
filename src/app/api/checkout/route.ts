import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/db";
import { isRateLimited, getClientIp } from "@/lib/admin-auth";

const INTASEND_API_URL = process.env.INTASEND_TEST_MODE === "true"
  ? "https://sandbox.intasend.com/api/v1"
  : "https://payment.intasend.com/api/v1";

const INTASEND_TOKEN = process.env.INTASEND_SECRET_KEY ?? "";
const APP_URL        = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function generateRef(): string {
  return `PTL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  // 20 checkout attempts per hour per IP
  if (isRateLimited(getClientIp(req), 20, 60 * 60 * 1000)) {
    return NextResponse.json({ message: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { customer, items, total, subtotal, deliveryFee, paymentMethod, mpesaPhone, deliveryMethod } = body;

    if (!customer?.email || !customer?.phone || !items?.length || !total) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const reference = generateRef();
    const amountKES = Math.round(total);

    // ── Save order to Supabase first ───────────────────────────────────────
    const savedOrder = await createOrder({
      reference,
      customer_name:    customer.name,
      customer_email:   customer.email,
      customer_phone:   customer.phone,
      items,
      subtotal:         Math.round(subtotal ?? amountKES),
      delivery_fee:     Math.round(deliveryFee ?? 0),
      total:            amountKES,
      payment_method:   paymentMethod,
      delivery_method:  deliveryMethod ?? "nairobi",
      delivery_address: customer.address ?? undefined,
    });

    // ── M-Pesa STK Push ────────────────────────────────────────────────────
    if (paymentMethod === "mpesa") {
      const phone = (mpesaPhone as string)
        .replace(/\s/g, "").replace(/^\+/, "").replace(/^0/, "254");

      const stkRes = await fetch(`${INTASEND_API_URL}/payment/mpesa-stk-push/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${INTASEND_TOKEN}` },
        body: JSON.stringify({
          amount:       amountKES,
          phone_number: phone,
          api_ref:      reference,
          narrative:    `Angela order ${reference}`,
          redirect_url: `${APP_URL}/checkout/success?ref=${reference}`,
        }),
      });

      if (!stkRes.ok) {
        const err = await stkRes.json();
        return NextResponse.json({ message: err?.detail ?? "M-Pesa request failed. Please check your phone number." }, { status: 400 });
      }

      const stkData = await stkRes.json();
      return NextResponse.json({ success: true, reference, invoiceId: stkData.invoice?.invoice_id });
    }

    // ── Card payment ────────────────────────────────────────────────────────
    if (paymentMethod === "card") {
      const chargeRes = await fetch(`${INTASEND_API_URL}/checkout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${INTASEND_TOKEN}` },
        body: JSON.stringify({
          first_name:   customer.name.split(" ")[0],
          last_name:    customer.name.split(" ").slice(1).join(" ") || ".",
          email:        customer.email,
          phone_number: customer.phone,
          country:      "KE",
          currency:     "KES",
          amount:       amountKES,
          api_ref:      reference,
          redirect_url: `${APP_URL}/checkout/success?ref=${reference}`,
          line_items:   items.map((item: { product: { name: string }; quantity: number; unitPrice: number }) => ({
            name: item.product.name, quantity: 1,
            amount: Math.round(item.unitPrice * (item.quantity / 100)),
          })),
        }),
      });

      if (!chargeRes.ok) {
        return NextResponse.json({ message: "Card payment setup failed" }, { status: 400 });
      }

      const chargeData = await chargeRes.json();
      return NextResponse.json({ success: true, reference, redirectUrl: chargeData.url });
    }

    return NextResponse.json({ message: "Invalid payment method" }, { status: 400 });

  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ message: "Server error. Please try again." }, { status: 500 });
  }
}