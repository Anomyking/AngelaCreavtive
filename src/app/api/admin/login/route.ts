import { NextRequest, NextResponse } from "next/server";
import {
  checkAdminPassword,
  createSessionToken,
  setAdminCookie,
  isRateLimited,
  getClientIp,
} from "@/lib/admin-auth";

// 10 attempts per 15 minutes per IP
const LIMIT = 10;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (isRateLimited(ip, LIMIT, WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  const { password } = await req.json();

  if (!checkAdminPassword(password ?? "")) {
    return NextResponse.json({ error: "Incorrect" }, { status: 401 });
  }

  const token = createSessionToken();
  const res = NextResponse.json({ success: true });
  setAdminCookie(res, token);
  return res;
}