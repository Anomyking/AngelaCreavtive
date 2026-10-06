"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function SignupForm() {
  const { signUp } = useAuth();
  const router      = useRouter();
  const params      = useSearchParams();
  const redirect    = params.get("redirect") ?? "/";

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");

    const { error } = await signUp(form.email, form.password, form.name, form.phone);
    if (error) { setError(error); setLoading(false); return; }

    // Supabase may require email confirmation — check
    setSuccess(true);
    // If email confirmation disabled in Supabase dashboard, redirect immediately:
    setTimeout(() => { router.push(redirect); router.refresh(); }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4">🎉</p>
          <h1 className="text-xl font-medium text-brand-300 mb-2">Account created!</h1>
          <p className="text-sm text-brand-600">Redirecting you now…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center"><span className="text-white text-sm">🖨️</span></div>
            <span className="font-semibold text-brand-300 text-lg">Angela</span>
          </Link>
          <h1 className="text-xl font-medium text-brand-300">Create your account</h1>
          <p className="text-sm text-brand-600 mt-1">Track orders, save your cart, reorder easily</p>
        </div>

        <div className="bg-brand-900 border border-brand-800 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-brand-500 block mb-1.5">Full name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Mwangi" autoFocus
                className="w-full text-sm bg-brand-950 border border-brand-800 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-300 placeholder:text-brand-700" />
            </div>
            <div>
              <label className="text-xs font-medium text-brand-500 block mb-1.5">Phone / WhatsApp *</label>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+254 700 000 000"
                className="w-full text-sm bg-brand-950 border border-brand-800 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-300 placeholder:text-brand-700" />
            </div>
            <div>
              <label className="text-xs font-medium text-brand-500 block mb-1.5">Email address *</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@company.co.ke"
                className="w-full text-sm bg-brand-950 border border-brand-800 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-300 placeholder:text-brand-700" />
            </div>
            <div>
              <label className="text-xs font-medium text-brand-500 block mb-1.5">Password *</label>
              <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                className="w-full text-sm bg-brand-950 border border-brand-800 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-300 placeholder:text-brand-700" />
            </div>
            <div>
              <label className="text-xs font-medium text-brand-500 block mb-1.5">Confirm password *</label>
              <input required type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Repeat password"
                className="w-full text-sm bg-brand-950 border border-brand-800 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-300 placeholder:text-brand-700" />
            </div>
            {error && <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">❌ {error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-brand-700 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account…</> : "Create account →"}
            </button>
            <p className="text-center text-xs text-brand-600">
              By signing up you agree to our <Link href="/terms" className="text-brand-500 hover:underline">Terms</Link> and <Link href="/privacy" className="text-brand-500 hover:underline">Privacy Policy</Link>
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-brand-600 mt-6">
          Already have an account?{" "}
          <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="text-brand-400 hover:text-brand-300 font-medium">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>;
}

