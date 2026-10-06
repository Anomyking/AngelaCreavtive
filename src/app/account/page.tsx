"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { createBrowser } from "@/lib/supabase-browser";
import { formatPrice } from "@/data";
import Link from "next/link";

interface Order {
  id: string; reference: string; total: number;
  status: string; created_at: string;
  items: Array<{ product: { name: string }; quantity: number }>;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700",
  printing: "bg-purple-100 text-purple-700", ready: "bg-emerald-100 text-emerald-700",
  dispatched: "bg-cyan-100 text-cyan-700",   delivered: "bg-green-100 text-green-700",
};

export default function AccountPage() {
  const { user, signOut, updateProfile } = useAuth();
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [profile,  setProfile]  = useState({ name: "", phone: "", company: "", address: "" });
  const [tab,      setTab]      = useState<"orders" | "profile">("orders");
  const [saving,   setSaving]   = useState(false);
  const [saveMsg,  setSaveMsg]  = useState("");
  const supabase = createBrowser();

  useEffect(() => {
    if (!user) return;
    // Load orders
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data ?? []) as Order[]));
    // Load profile
    supabase.from("profiles").select("*").eq("id", user.id).single()
      .then(({ data }) => { if (data) setProfile({ name: data.name ?? "", phone: data.phone ?? "", company: data.company ?? "", address: data.address ?? "" }); });
  }, [user?.id]);

  const handleSaveProfile = async () => {
    setSaving(true); setSaveMsg("");
    const { error } = await updateProfile(profile);
    setSaveMsg(error ? `❌ ${error}` : "✅ Profile saved!");
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  if (!user) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">🔒</p>
        <p className="text-sm text-brand-600 mb-4">Please sign in to view your account</p>
        <Link href="/auth/login" className="inline-flex bg-brand-700 text-white text-sm px-6 py-3 rounded-full hover:bg-brand-600">Sign in</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Header */}
      <div className="bg-brand-950 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-600 uppercase tracking-widest mb-1">My account</p>
            <h1 className="text-2xl font-medium text-brand-300">{profile.name || user.email}</h1>
            <p className="text-sm text-brand-600 mt-0.5">{user.email}</p>
          </div>
          <button onClick={signOut} className="text-xs border border-brand-800 hover:border-brand-600 text-brand-600 hover:text-brand-400 px-4 py-2 rounded-full transition-colors">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["orders", "profile"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors capitalize ${tab === t ? "bg-brand-700 text-white" : "bg-white border border-brand-100 text-brand-600 hover:border-brand-300"}`}>
              {t === "orders" ? `📦 My orders (${orders.length})` : "👤 Profile"}
            </button>
          ))}
        </div>

        {/* Orders tab */}
        {tab === "orders" && (
          <div className="bg-white border border-brand-100 rounded-2xl overflow-hidden">
            {orders.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-4xl mb-3">🛒</p>
                <p className="text-sm font-medium text-brand-700 mb-2">No orders yet</p>
                <p className="text-xs text-brand-400 mb-6">Your orders will appear here after you place them</p>
                <Link href="/#products" className="inline-flex bg-brand-700 text-white text-sm px-6 py-3 rounded-full hover:bg-brand-600">Browse products</Link>
              </div>
            ) : (
              <div className="divide-y divide-brand-50">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between px-6 py-5">
                    <div>
                      <p className="text-sm font-medium text-brand-900 font-mono">{order.reference}</p>
                      <p className="text-xs text-brand-500 mt-0.5">
                        {order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""} · {new Date(order.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      {order.items?.[0] && <p className="text-xs text-brand-400 mt-0.5 truncate max-w-xs">{order.items[0].product?.name}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-brand-900">{formatPrice(order.total)}</p>
                      <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full mt-1 inline-block capitalize ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile tab */}
        {tab === "profile" && (
          <div className="bg-white border border-brand-100 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-brand-950 mb-5">Your details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                { label: "Full name",    key: "name",    placeholder: "Jane Mwangi"            },
                { label: "Phone / WhatsApp", key: "phone", placeholder: "+254 700 000 000"     },
                { label: "Company",      key: "company", placeholder: "Optional"                },
                { label: "Default delivery address", key: "address", placeholder: "Street, area, Nairobi" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-medium text-brand-600 block mb-1.5">{label}</label>
                  <input value={profile[key as keyof typeof profile]}
                    onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-800 placeholder:text-brand-300" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleSaveProfile} disabled={saving}
                className="py-3 px-8 bg-brand-700 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium rounded-full transition-colors">
                {saving ? "Saving…" : "Save profile"}
              </button>
              {saveMsg && <p className="text-xs text-brand-600">{saveMsg}</p>}
            </div>
            <div className="mt-6 pt-6 border-t border-brand-50">
              <p className="text-xs text-brand-400">Email: <span className="text-brand-600">{user.email}</span> · <Link href="/auth/forgot" className="text-brand-600 hover:underline">Change password</Link></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

