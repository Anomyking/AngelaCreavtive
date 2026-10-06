import { NextRequest, NextResponse } from "next/server";
import { updateQuote } from "@/lib/db";
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body   = await req.json();
    const quote  = await updateQuote(id, { status: body.status, quoted_amount: body.quoted_amount, admin_notes: body.admin_notes });
    return NextResponse.json({ quote });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

