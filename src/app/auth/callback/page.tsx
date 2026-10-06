"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowser } from "@/lib/supabase-browser";
export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => { createBrowser().auth.getSession().then(() => router.push("/")); }, []);
  return <div className="min-h-screen bg-brand-950 flex items-center justify-center"><p className="text-brand-400 text-sm">Confirming your account…</p></div>;
}

