import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD;

// ── Startup guard ─────────────────────────────────────────────────────────────
// Fail loudly at boot rather than silently allowing access with a default value.
if (!ADMIN_PASSWORD) {
  throw new Error(
    "ADMIN_PASSWORD env var is not set. Add it to .env.local before starting the server."
  );
}

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ── Token helpers ─────────────────────────────────────────────────────────────

/** Create a random, signed session token. */
export function createSessionToken(): string {
  const random = crypto.randomBytes(32).toString("hex");
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET!)
    .update(random)
    .digest("hex");
  return `${random}.${sig}`;
}

/** Return true only if the token was produced by createSessionToken(). */
export function isValidSessionToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [random, sig] = parts;
  const expected = crypto
    .createHmac("sha256", SESSION_SECRET!)
    .update(random)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

// ── Cookie helpers ────────────────────────────────────────────────────────────

export function setAdminCookie(res: NextResponse, token: string) {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export function clearAdminCookie(res: NextResponse) {
  res.cookies.delete(COOKIE_NAME);
}

// ── Password check ────────────────────────────────────────────────────────────

export function checkAdminPassword(password: string): boolean {
  // timingSafeEqual prevents timing-based password enumeration
  try {
    return crypto.timingSafeEqual(
      Buffer.from(password),
      Buffer.from(ADMIN_PASSWORD!)
    );
  } catch {
    return false; // buffers differ in length
  }
}

// ── Route guard ───────────────────────────────────────────────────────────────

/**
 * Call at the top of every /api/admin/* route handler.
 * Returns null if the request is authenticated, or a 401 NextResponse to return immediately.
 */
export async function requireAdminAuth(
  req: NextRequest
): Promise<NextResponse | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value ?? "";
  if (!token || !isValidSessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// ── Simple in-memory rate limiter ─────────────────────────────────────────────
// Good enough for a single-instance Vercel deployment. For multi-region,
// swap this out for Upstash Redis (@upstash/ratelimit).

type RateRecord = { count: number; resetAt: number };
const store = new Map<string, RateRecord>();

/**
 * Returns true if the request should be blocked.
 * @param key    Identifier (e.g. IP address)
 * @param limit  Max requests per window
 * @param windowMs  Window in milliseconds
 */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const rec = store.get(key);

  if (!rec || now > rec.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  rec.count += 1;
  if (rec.count > limit) return true;
  return false;
}

/** Get client IP from Vercel/Next headers, falling back to a fixed key. */
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}