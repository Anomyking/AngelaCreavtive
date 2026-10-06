import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-auth";
import { updateOrderStatus } from "@/lib/db";
import { sendDeliveryUpdate } from "@/lib/email";
import { OrderStatus } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const unauth = await requireAdminAuth(req);
  if (unauth) return unauth;

  try {
    const { reference, status, tracking_code } = await req.json();
    if (!reference || !status) return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    const order = await updateOrderStatus(reference, status as OrderStatus, { tracking_code });
    const emailable = ["printing", "ready", "dispatched", "delivered"];
    if (emailable.includes(status)) {
      await sendDeliveryUpdate({ reference: order.reference, customerName: order.customer_name, customerEmail: order.customer_email, status, trackingCode: tracking_code });
    }
    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}