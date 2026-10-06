"use client";
import { useState } from "react";
import Link from "next/link";
import { createBrowser } from "@/lib/supabase-browser";
export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const redirectTo = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      : `${window.location.origin}/auth/callback`;
    await createBrowser().auth.resetPasswordForEmail(email, { redirectTo });
    setSent(true); setLoading(false);
  };
  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8"><p className="text-4xl mb-3">🔑</p><h1 className="text-xl font-medium text-brand-300">Reset your password</h1></div>
        {sent ? (
          <div className="bg-brand-900 border border-brand-800 rounded-2xl p-6 text-center">
            <p className="text-sm text-brand-400">Check your email for a reset link sent to <strong className="text-brand-300">{email}</strong></p>
            <Link href="/auth/login" className="mt-4 inline-flex text-xs text-brand-600 hover:text-brand-400">Back to login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-brand-900 border border-brand-800 rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-brand-500 block mb-1.5">Email address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus placeholder="jane@company.co.ke"
                className="w-full text-sm bg-brand-950 border border-brand-800 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-300 placeholder:text-brand-700" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-brand-700 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium rounded-full transition-colors">
              {loading ? "Sending…" : "Send reset link →"}
            </button>
            <p className="text-center text-xs"><Link href="/auth/login" className="text-brand-600 hover:text-brand-400">Back to login</Link></p>
          </form>
        )}
      </div>
    </div>
  );
}

