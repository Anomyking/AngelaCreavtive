"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Incorrect password. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-4xl mb-3">🖨️</p>
          <h1 className="text-xl font-medium text-brand-300">Angela Admin</h1>
          <p className="text-sm text-brand-600 mt-1">Sign in to manage orders and quotes</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-brand-900 border border-brand-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-brand-500 block mb-2">Admin password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              autoFocus
              className="w-full text-sm bg-brand-950 border border-brand-800 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-300 placeholder:text-brand-700"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">❌ {error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-brand-700 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium rounded-full transition-colors">
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>

      </div>
    </div>
  );
}

