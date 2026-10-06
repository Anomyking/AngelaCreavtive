import { createBrowserClient } from "@supabase/ssr";

// Accept both old (ANON_KEY) and new (PUBLISHABLE_KEY) variable names
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const KEY = PUBLISHABLE_KEY ?? ANON_KEY ?? "placeholder";
const KEY_TYPE = PUBLISHABLE_KEY ? "publishable" : ANON_KEY ? "anon" : "missing";

if (process.env.NODE_ENV !== "production") {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("Supabase browser client missing NEXT_PUBLIC_SUPABASE_URL env var.");
  }
  if (KEY === "placeholder") {
    console.error("Supabase browser client missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  } else {
    console.debug(`Supabase browser client using ${KEY_TYPE} key.`);
  }
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  if (typeof atob === "function") {
    return atob(padded);
  }
  return Buffer.from(padded, "base64").toString("utf8");
}

function isServiceRoleKey(key: string) {
  try {
    const parts = key.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    return payload?.role === "service_role";
  } catch {
    return false;
  }
}

if (process.env.NODE_ENV !== "production" && isServiceRoleKey(KEY)) {
  console.error(
    "Supabase browser client is using a service_role key. " +
    "Use NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for browser auth, " +
    "and keep SUPABASE_SERVICE_ROLE_KEY server-side only."
  );
}

export function createBrowser() {
  return createBrowserClient(URL, KEY);
}

