import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-auth";
import { updateOrderStatus, setOrderPaymentStatus } from "@/lib/db";
import type { OrderStatus, PaymentStatus, DBOrder } from "@/lib/db";
import { sendDeliveryUpdate } from "@/lib/email";

const ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed", "printing", "ready", "dispatched", "delivered", "cancelled"];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];

// PATCH /api/admin/status
// { reference, status?, tracking_code?, payment_status? } — at least one of status / payment_status
export async function PATCH(req: NextRequest) {
  const unauth = await requireAdminAuth(req);
  if (unauth) return unauth;

  try {
    const { reference, status, tracking_code, payment_status } = await req.json();

    if (!reference || (!status && !payment_status)) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }
    if (status && !ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }
    if (payment_status && !PAYMENT_STATUSES.includes(payment_status)) {
      return NextResponse.json({ message: "Invalid payment status" }, { status: 400 });
    }

    let order: DBOrder | undefined;

    if (payment_status) {
      order = await setOrderPaymentStatus(reference, payment_status);
    }

    if (status) {
      order = await updateOrderStatus(reference, status as OrderStatus, { tracking_code });
      const emailable = ["printing", "ready", "dispatched", "delivered"];
      if (emailable.includes(status)) {
        await sendDeliveryUpdate({
          reference:     order.reference,
          customerName:  order.customer_name,
          customerEmail: order.customer_email,
          status,
          trackingCode:  tracking_code,
        });
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
