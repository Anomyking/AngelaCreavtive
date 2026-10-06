"use client";

import { useState } from "react";
import type { Metadata } from "next";

const contactMethods = [
  { icon: "💬", label: "WhatsApp",     value: "+254 700 000 000", href: "https://wa.me/254700000000", sub: "Fastest response — usually under 5 mins" },
  { icon: "📞", label: "Call us",      value: "+254 700 000 000", href: "tel:+254700000000",           sub: "Mon – Sat, 8 AM – 6 PM"                },
  { icon: "📧", label: "Email",        value: "hello@angela.co.ke", href: "mailto:hello@angela.co.ke", sub: "We reply within a few hours"           },
  { icon: "📍", label: "Visit us",     value: "Westlands, Nairobi",   href: "#map",                        sub: "Mon – Sat, 8 AM – 6 PM"                },
];

export default function ContactPage() {
  const [form,    setForm]    = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      // Reuse the quote API to send a contact message
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          product: form.subject || "General enquiry",
          quantity: "N/A",
          description: form.message,
        }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please WhatsApp us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-brand-950 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-600 mb-3">Get in touch</p>
          <h1 className="text-3xl font-medium text-brand-300 mb-3">Contact us</h1>
          <p className="text-sm text-brand-600">We&apos;re available Mon – Sat, 8 AM – 6 PM. WhatsApp is the fastest way to reach us.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Contact methods */}
          <div className="lg:col-span-2 space-y-4">
            {contactMethods.map((m) => (
              <a key={m.label} href={m.href}
                className="flex items-start gap-4 bg-brand-50 border border-brand-100 hover:border-brand-400 rounded-2xl p-5 transition-colors group">
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <p className="text-xs font-medium text-brand-400 uppercase tracking-wider mb-0.5">{m.label}</p>
                  <p className="text-sm font-medium text-brand-900 group-hover:text-brand-700">{m.value}</p>
                  <p className="text-xs text-brand-500 mt-0.5">{m.sub}</p>
                </div>
              </a>
            ))}

            {/* Map embed placeholder */}
            <div id="map" className="bg-brand-50 border border-brand-100 rounded-2xl overflow-hidden h-48 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl mb-2">📍</p>
                <p className="text-sm font-medium text-brand-700">Westlands, Nairobi</p>
                <a href="https://maps.google.com/?q=Westlands+Nairobi" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-brand-600 hover:underline mt-1 block">Open in Google Maps →</a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">
                <p className="text-4xl mb-4">🎉</p>
                <h2 className="text-lg font-medium text-emerald-800 mb-2">Message received!</h2>
                <p className="text-sm text-emerald-700">We&apos;ll get back to you within a few hours. For urgent matters, WhatsApp us directly.</p>
                <a href="https://wa.me/254700000000" className="mt-6 inline-flex bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-emerald-700 transition-colors">
                  💬 Open WhatsApp
                </a>
              </div>
            ) : (
              <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6">
                <h2 className="text-base font-medium text-brand-950 mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-brand-700 block mb-1.5">Full name *</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Jane Mwangi"
                        className="w-full text-sm bg-white border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-800 placeholder:text-brand-300" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brand-700 block mb-1.5">Phone</label>
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+254 700 000 000"
                        className="w-full text-sm bg-white border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-800 placeholder:text-brand-300" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-brand-700 block mb-1.5">Email address *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@company.co.ke"
                      className="w-full text-sm bg-white border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-800 placeholder:text-brand-300" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-brand-700 block mb-1.5">Subject</label>
                    <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="e.g. Business account enquiry, bulk order, complaint…"
                      className="w-full text-sm bg-white border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-800 placeholder:text-brand-300" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-brand-700 block mb-1.5">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us what you need…"
                      className="w-full text-sm bg-white border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none resize-none text-brand-800 placeholder:text-brand-300" />
                  </div>
                  {error && <p className="text-xs text-red-500">❌ {error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full py-4 bg-brand-700 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-2">
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
                      : "Send message →"}
                  </button>
                  <p className="text-center text-xs text-brand-400">Or <a href="https://wa.me/254700000000" className="text-brand-600 hover:underline">WhatsApp us</a> for the fastest response</p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

