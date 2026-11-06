"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data";
import { useRouter } from "next/navigation";
import Link from "next/link";

type DeliveryMethod = "pickup" | "nairobi" | "nationwide";

const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  pickup:     0,
  nairobi:    450,
  nationwide: 850,
};

const DELIVERY_LABELS: Record<DeliveryMethod, string> = {
  pickup:     "Pick up in Westlands, Nairobi",
  nairobi:    "Delivery within Nairobi",
  nationwide: "Nationwide courier delivery",
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [step,           setStep]           = useState<1 | 2>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("nairobi");
  const [loading,        setLoading]        = useState(false);
  const [placed,         setPlaced]         = useState(false);
  const [error,          setError]          = useState("");

  const [customer, setCustomer] = useState({
    name: "", email: "", phone: "", company: "", address: "",
  });

  const deliveryFee = subtotal >= 7000 ? 0 : DELIVERY_FEES[deliveryMethod];
  const total       = subtotal + deliveryFee;

  // ── Step 1: Details ─────────────────────────────────────────────────────────
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  // ── Step 2: Review & place order ────────────────────────────────────────────
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items,
          subtotal,
          deliveryFee,
          total,
          deliveryMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message ?? "Could not place your order");

      // `placed` stops the "cart is empty" screen flashing while we navigate away
      setPlaced(true);
      clearCart();
      router.push(`/checkout/success?ref=${data.reference}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ── Empty cart ───────────────────────────────────────────────────────────────
  if (items.length === 0 && !placed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl mb-4">🛒</p>
          <h1 className="text-xl font-medium text-brand-950 mb-2">Your cart is empty</h1>
          <p className="text-sm text-brand-500 mb-6">Add some products before checking out.</p>
          <Link href="/#products" className="inline-flex bg-brand-700 text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-brand-600 transition-colors">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50">

      {/* Header */}
      <div className="bg-white border-b border-brand-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-brand-950">🖨️ Angela</Link>
          <div className="flex items-center gap-3">
            {["Details", "Review & place order"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${step > i + 1 ? "bg-emerald-500 text-white" : step === i + 1 ? "bg-brand-700 text-white" : "bg-brand-100 text-brand-400"}`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${step === i + 1 ? "text-brand-800 font-medium" : "text-brand-400"}`}>{label}</span>
                {i < 1 && <span className="text-brand-200 text-xs">›</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main form ── */}
          <div className="lg:col-span-2">

            {/* ── STEP 1: Customer details ── */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-brand-100 p-6">
                <h2 className="text-lg font-medium text-brand-950 mb-6">Your details</h2>
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-brand-700 block mb-1.5">Full name *</label>
                      <input required value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="Jane Mwangi"
                        className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-800 placeholder:text-brand-300" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brand-700 block mb-1.5">Company</label>
                      <input value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                        placeholder="Optional"
                        className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-800 placeholder:text-brand-300" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-brand-700 block mb-1.5">Email address *</label>
                    <input required type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="jane@company.co.ke"
                      className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-800 placeholder:text-brand-300" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-brand-700 block mb-1.5">Phone / WhatsApp *</label>
                    <input required value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="+254 700 000 000"
                      className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-800 placeholder:text-brand-300" />
                    <p className="text-xs text-brand-400 mt-1">We&apos;ll use this to confirm your order and arrange payment.</p>
                  </div>

                  {/* Delivery method */}
                  <div>
                    <label className="text-xs font-medium text-brand-700 block mb-3">Delivery method *</label>
                    <div className="space-y-2">
                      {([
                        { value: "pickup",     label: DELIVERY_LABELS.pickup,     fee: 0,   icon: "🏪" },
                        { value: "nairobi",    label: DELIVERY_LABELS.nairobi,    fee: subtotal >= 7000 ? 0 : 450,  icon: "🚚" },
                        { value: "nationwide", label: DELIVERY_LABELS.nationwide, fee: subtotal >= 7000 ? 0 : 850,  icon: "📦" },
                      ] as const).map((opt) => (
                        <label key={opt.value} className={`flex items-center justify-between gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${deliveryMethod === opt.value ? "border-brand-500 bg-brand-50" : "border-brand-100 hover:border-brand-300"}`}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="delivery" value={opt.value}
                              checked={deliveryMethod === opt.value}
                              onChange={() => setDeliveryMethod(opt.value)}
                              className="accent-brand-700" />
                            <span className="text-lg">{opt.icon}</span>
                            <span className="text-sm text-brand-800">{opt.label}</span>
                          </div>
                          <span className={`text-sm font-medium ${opt.fee === 0 ? "text-emerald-600" : "text-brand-700"}`}>
                            {opt.fee === 0 ? "FREE" : formatPrice(opt.fee)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {deliveryMethod !== "pickup" && (
                    <div>
                      <label className="text-xs font-medium text-brand-700 block mb-1.5">
                        Delivery address *
                      </label>
                      <textarea required rows={2} value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder="Street, building, area — e.g. ABC Towers, 3rd floor, Upperhill, Nairobi"
                        className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none resize-none text-brand-800 placeholder:text-brand-300" />
                    </div>
                  )}

                  <button type="submit" className="w-full py-4 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium rounded-full transition-colors">
                    Continue to review →
                  </button>
                </form>
              </div>
            )}

            {/* ── STEP 2: Review & place order ── */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-brand-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setStep(1)} disabled={loading} className="text-xs text-brand-500 hover:text-brand-800 disabled:opacity-50">← Back</button>
                  <h2 className="text-lg font-medium text-brand-950">Review &amp; place order</h2>
                </div>

                {/* Details summary */}
                <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-4 space-y-2">
                  <div className="flex justify-between gap-4 text-xs">
                    <span className="text-brand-400 shrink-0">Name</span>
                    <span className="text-brand-800 font-medium text-right break-words min-w-0">{customer.name}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-xs">
                    <span className="text-brand-400 shrink-0">Email</span>
                    <span className="text-brand-800 font-medium text-right break-all min-w-0">{customer.email}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-xs">
                    <span className="text-brand-400 shrink-0">Phone</span>
                    <span className="text-brand-800 font-medium text-right">{customer.phone}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-xs">
                    <span className="text-brand-400 shrink-0">Delivery</span>
                    <span className="text-brand-800 font-medium text-right">{DELIVERY_LABELS[deliveryMethod]}</span>
                  </div>
                  {deliveryMethod !== "pickup" && customer.address && (
                    <div className="flex justify-between gap-4 text-xs">
                      <span className="text-brand-400 shrink-0">Address</span>
                      <span className="text-brand-800 font-medium text-right break-words min-w-0">{customer.address}</span>
                    </div>
                  )}
                </div>

                {/* How payment works */}
                <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-6">
                  <p className="text-sm font-medium text-brand-900 mb-2">💬 How payment works</p>
                  <p className="text-xs text-brand-600 leading-relaxed">
                    There&apos;s no online payment at checkout. Once you place your order, our team will
                    contact you by WhatsApp, phone or email to confirm it and arrange payment of{" "}
                    <strong>{formatPrice(total)}</strong>. We begin production once payment is confirmed.
                  </p>
                </div>

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <p className="text-xs text-red-600">❌ {error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-brand-700 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Placing your order…
                      </>
                    ) : (
                      `Place order · ${formatPrice(total)}`
                    )}
                  </button>

                  <p className="text-xs text-brand-400 text-center">
                    You&apos;ll get an email confirmation as soon as your order is placed.
                  </p>
                </form>
              </div>
            )}
          </div>

          {/* ── Order summary sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-brand-100 p-5 sticky top-24">
              <h3 className="text-sm font-medium text-brand-950 mb-4">Order summary</h3>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center text-lg shrink-0">🖨️</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-brand-800 truncate">{item.product.name}</p>
                      <p className="text-[10px] text-brand-400">{item.quantity.toLocaleString()} pcs · {item.finish}</p>
                    </div>
                    <p className="text-xs font-medium text-brand-800 shrink-0">
                      {formatPrice(Math.round(item.unitPrice * (item.quantity / 100)))}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-50 pt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-brand-500">Subtotal</span>
                  <span className="text-brand-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-brand-500">Delivery</span>
                  <span className={deliveryFee === 0 ? "text-emerald-600 font-medium" : "text-brand-800"}>
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium pt-2 border-t border-brand-50">
                  <span className="text-brand-950">Total</span>
                  <span className="text-brand-950">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-4 bg-brand-50 rounded-xl p-3 space-y-2">
                {["🛡️ Reprint guarantee", "⚡ Confirmed within 1hr", "📧 Email confirmation"].map((t) => (
                  <p key={t} className="text-xs text-brand-600">{t}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
