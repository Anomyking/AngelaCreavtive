"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data";
import { useRouter } from "next/navigation";

type PaymentMethod = "mpesa" | "card";
type DeliveryMethod = "pickup" | "nairobi" | "nationwide";

const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  pickup:     0,
  nairobi:    450,
  nationwide: 850,
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [step,           setStep]           = useState<1 | 2 | 3>(1);
  const [paymentMethod,  setPaymentMethod]  = useState<PaymentMethod>("mpesa");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("nairobi");
  const [loading,        setLoading]        = useState(false);
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

  // ── Step 2: Payment ─────────────────────────────────────────────────────────
  const handlePayment = async (e: React.FormEvent) => {
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
          total,
          deliveryMethod,
          paymentMethod,
          // Phone must be in 2547XXXXXXXX format for M-Pesa STK push
          mpesaPhone: customer.phone.replace(/^0/, "254").replace(/^\+/, ""),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message ?? "Payment failed");

      clearCart();

      if (paymentMethod === "mpesa") {
        // M-Pesa STK push sent — show waiting screen
        setStep(3);
        // Poll for payment confirmation (simplified — in production use webhooks)
        setTimeout(() => router.push(`/checkout/success?ref=${data.reference}`), 3000);
      } else {
        // Card — redirect to IntaSend hosted page
        window.location.href = data.redirectUrl;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Empty cart ───────────────────────────────────────────────────────────────
  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl mb-4">🛒</p>
          <h1 className="text-xl font-medium text-brand-950 mb-2">Your cart is empty</h1>
          <p className="text-sm text-brand-500 mb-6">Add some products before checking out.</p>
          <a href="/#products" className="inline-flex bg-brand-700 text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-brand-600 transition-colors">
            Browse products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50">

      {/* Header */}
      <div className="bg-white border-b border-brand-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-base font-semibold text-brand-950">🖨️ Angela</a>
          <div className="flex items-center gap-3">
            {["Details", "Payment", "Confirm"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${step > i + 1 ? "bg-emerald-500 text-white" : step === i + 1 ? "bg-brand-700 text-white" : "bg-brand-100 text-brand-400"}`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${step === i + 1 ? "text-brand-800 font-medium" : "text-brand-400"}`}>{label}</span>
                {i < 2 && <span className="text-brand-200 text-xs">›</span>}
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
                  </div>

                  {/* Delivery method */}
                  <div>
                    <label className="text-xs font-medium text-brand-700 block mb-3">Delivery method *</label>
                    <div className="space-y-2">
                      {([
                        { value: "pickup",     label: "Pick up in Westlands, Nairobi", fee: 0,   icon: "🏪" },
                        { value: "nairobi",    label: "Delivery within Nairobi",       fee: subtotal >= 7000 ? 0 : 450,  icon: "🚚" },
                        { value: "nationwide", label: "Nationwide courier delivery",   fee: subtotal >= 7000 ? 0 : 850,  icon: "📦" },
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
                    Continue to payment →
                  </button>
                </form>
              </div>
            )}

            {/* ── STEP 2: Payment ── */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-brand-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setStep(1)} className="text-xs text-brand-500 hover:text-brand-800">← Back</button>
                  <h2 className="text-lg font-medium text-brand-950">Payment</h2>
                </div>

                {/* Payment method selector */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {([
                    { value: "mpesa", label: "M-Pesa",   icon: "📱", sub: "STK push to your phone" },
                    { value: "card",  label: "Card",      icon: "💳", sub: "Visa or Mastercard"     },
                  ] as const).map((opt) => (
                    <button key={opt.value} onClick={() => setPaymentMethod(opt.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${paymentMethod === opt.value ? "border-brand-700 bg-brand-50" : "border-brand-100 hover:border-brand-300"}`}>
                      <span className="text-2xl">{opt.icon}</span>
                      <span className={`text-sm font-medium ${paymentMethod === opt.value ? "text-brand-800" : "text-brand-600"}`}>{opt.label}</span>
                      <span className="text-xs text-brand-400">{opt.sub}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                  {paymentMethod === "mpesa" && (
                    <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
                      <p className="text-sm font-medium text-brand-900 mb-2">📱 M-Pesa STK Push</p>
                      <p className="text-xs text-brand-600 leading-relaxed mb-4">
                        After clicking pay, you&apos;ll receive an M-Pesa prompt on your phone at{" "}
                        <strong>{customer.phone}</strong>. Enter your M-Pesa PIN to complete the payment.
                      </p>
                      <div>
                        <label className="text-xs font-medium text-brand-700 block mb-1.5">
                          M-Pesa phone number *
                        </label>
                        <input
                          required
                          type="tel"
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          placeholder="0712 345 678"
                          className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-800 bg-white"
                        />
                        <p className="text-xs text-brand-400 mt-1">Must be a registered Safaricom M-Pesa number</p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
                      <p className="text-sm font-medium text-brand-900 mb-2">💳 Card payment</p>
                      <p className="text-xs text-brand-600 leading-relaxed">
                        You&apos;ll be redirected to our secure payment page powered by IntaSend. Visa and Mastercard accepted.
                      </p>
                    </div>
                  )}

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
                        {paymentMethod === "mpesa" ? "Sending M-Pesa prompt…" : "Redirecting…"}
                      </>
                    ) : (
                      `Pay ${formatPrice(total)} via ${paymentMethod === "mpesa" ? "M-Pesa" : "Card"} →`
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 pt-2">
                    <span className="text-xs text-brand-400">🔒 Secured by IntaSend</span>
                    <span className="text-xs text-brand-400">·</span>
                    <span className="text-xs text-brand-400">SSL encrypted</span>
                  </div>
                </form>
              </div>
            )}

            {/* ── STEP 3: M-Pesa waiting ── */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-brand-100 p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📱</span>
                </div>
                <h2 className="text-lg font-medium text-brand-950 mb-2">Check your phone</h2>
                <p className="text-sm text-brand-600 leading-relaxed mb-4">
                  We&apos;ve sent an M-Pesa STK push to <strong>{customer.phone}</strong>.
                  Enter your PIN to confirm payment of <strong>{formatPrice(total)}</strong>.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-brand-400">
                  <span className="w-3 h-3 border-2 border-brand-300 border-t-brand-700 rounded-full animate-spin" />
                  Waiting for payment confirmation…
                </div>
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

