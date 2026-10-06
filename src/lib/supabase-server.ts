import { createServerClient } from "@supabase/ssr";
import { createClient }        from "@supabase/supabase-js";
import { cookies }             from "next/headers";

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const KEY  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
          ?? "";
const SVC  = process.env.SUPABASE_SERVICE_ROLE_KEY
          ?? process.env.SUPABASE_SECRET_KEY
          ?? "";

export async function createServer() {
  const cookieStore = await cookies();
  return createServerClient(URL, KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
    },
  });
}

export function getServerSupabase() {
  if (!URL || !SVC) {
    throw new Error("Supabase service role env vars missing. Add SUPABASE_SERVICE_ROLE_KEY to .env.local");
  }
  return createClient(URL, SVC, { auth: { persistSession: false } });
}

