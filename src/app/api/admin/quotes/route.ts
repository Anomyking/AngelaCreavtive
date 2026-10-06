import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-auth";
import { getQuotes, updateQuote } from "@/lib/db";

export async function GET(req: NextRequest) {
  const unauth = await requireAdminAuth(req);
  if (unauth) return unauth;

  try {
    const quotes = await getQuotes({ limit: 100 });
    return NextResponse.json({ quotes });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ quotes: [] });
  }
}

export async function PATCH(req: NextRequest) {
  const unauth = await requireAdminAuth(req);
  if (unauth) return unauth;

  try {
    const { id, ...update } = await req.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const quote = await updateQuote(id, update);
    return NextResponse.json({ success: true, quote });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update quote" }, { status: 500 });
  }
}