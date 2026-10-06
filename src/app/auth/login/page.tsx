"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const { signIn } = useAuth();
  const router      = useRouter();
  const params      = useSearchParams();
  const redirect    = params.get("redirect") ?? "/";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const { error } = await signIn(email, password);
    if (error) { setError(error); setLoading(false); return; }
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center"><span className="text-white text-sm">🖨️</span></div>
            <span className="font-semibold text-brand-300 text-lg">Angela</span>
          </Link>
          <h1 className="text-xl font-medium text-brand-300">Welcome back</h1>
          <p className="text-sm text-brand-600 mt-1">Sign in to continue</p>
        </div>

        <div className="bg-brand-900 border border-brand-800 rounded-2xl p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-brand-500 block mb-1.5">Email address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.co.ke" autoFocus
                className="w-full text-sm bg-brand-950 border border-brand-800 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-300 placeholder:text-brand-700" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-medium text-brand-500">Password</label>
                <Link href="/auth/forgot" className="text-xs text-brand-600 hover:text-brand-400">Forgot password?</Link>
              </div>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-brand-950 border border-brand-800 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-300 placeholder:text-brand-700" />
            </div>
            {error && <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">❌ {error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-brand-700 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</> : "Sign in →"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-brand-600 mt-6">
          No account?{" "}
          <Link href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`} className="text-brand-400 hover:text-brand-300 font-medium">
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}

