import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-auth";
import { upsertProductStatus, getAllProductStatuses } from "@/lib/db";

export async function GET(req: NextRequest) {
  const unauth = await requireAdminAuth(req);
  if (unauth) return unauth;

  try {
    return NextResponse.json({ statuses: await getAllProductStatuses() });
  } catch {
    return NextResponse.json({ statuses: [] });
  }
}

export async function PATCH(req: NextRequest) {
  const unauth = await requireAdminAuth(req);
  if (unauth) return unauth;

  try {
    const { product_id, stock_status, override_price, is_hidden, admin_note } = await req.json();
    if (!product_id) {
      return NextResponse.json({ error: "product_id is required" }, { status: 400 });
    }
    const result = await upsertProductStatus({ product_id, stock_status, override_price, is_hidden, admin_note });
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}