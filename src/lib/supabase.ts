// Re-export browser client (safe to use anywhere)
export { createBrowser } from "@/lib/supabase-browser";
// Server-only exports live in supabase-server.ts
// Import them only in Server Components and API routes

