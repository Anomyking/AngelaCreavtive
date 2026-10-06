"use client";

import { useState, useEffect } from "react";

interface Quote {
  id: string; customer_name: string; customer_email: string;
  customer_phone: string; company?: string; product_name: string;
  quantity: string; description: string; timeline?: string;
  design_file_name?: string; status: string;
  quoted_amount?: number; admin_notes?: string; created_at: string;
}

const statusColors: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  quoted:   "bg-blue-100 text-blue-700",
  accepted: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-600",
};

export default function QuotesPage() {
  const [quotes,   setQuotes]   = useState<Quote[]>([]);
  const [selected, setSelected] = useState<Quote | null>(null);
  const [amount,   setAmount]   = useState("");
  const [notes,    setNotes]    = useState("");
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState("");

  useEffect(() => {
    fetch("/api/admin/quotes").then(r => r.json()).then(d => setQuotes(d.quotes ?? [])).catch(() => {});
  }, []);

  const handleSelect = (q: Quote) => {
    setSelected(q);
    setAmount(q.quoted_amount?.toString() ?? "");
    setNotes(q.admin_notes ?? "");
    setMsg("");
  };

  const handleSave = async (status: string) => {
    if (!selected) return;
    setSaving(true); setMsg("");
    const res = await fetch(`/api/admin/quotes/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, quoted_amount: amount ? parseInt(amount) : undefined, admin_notes: notes }),
    });
    if (res.ok) {
      setMsg("✅ Saved!");
      setQuotes(prev => prev.map(q => q.id === selected.id ? { ...q, status, quoted_amount: amount ? parseInt(amount) : undefined, admin_notes: notes } : q));
      setSelected(prev => prev ? { ...prev, status, quoted_amount: amount ? parseInt(amount) : undefined } : null);
    } else { setMsg("❌ Save failed"); }
    setSaving(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-brand-950">Quotes</h1>
        <p className="text-sm text-brand-500 mt-1">{quotes.filter(q => q.status === "pending").length} pending · {quotes.length} total</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Quotes list */}
        <div className="bg-white border border-brand-100 rounded-2xl overflow-hidden">
          {quotes.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm text-brand-400">No quote requests yet</p>
            </div>
          ) : (
            <div className="divide-y divide-brand-50">
              {quotes.map((q) => (
                <button key={q.id} onClick={() => handleSelect(q)}
                  className={`w-full flex items-start justify-between gap-4 px-5 py-4 hover:bg-brand-50 transition-colors text-left ${selected?.id === q.id ? "bg-brand-50 border-l-2 border-brand-700" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-900">{q.customer_name}</p>
                    <p className="text-xs text-brand-500 mt-0.5 truncate">{q.product_name} · {q.quantity}</p>
                    <p className="text-xs text-brand-400 mt-0.5">{new Date(q.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0 capitalize ${statusColors[q.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {q.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quote detail + action */}
        {selected ? (
          <div className="bg-white border border-brand-100 rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-base font-medium text-brand-950">{selected.customer_name}</h2>
              <div className="flex gap-3 mt-2">
                <a href={`https://wa.me/${selected.customer_phone.replace(/\D/g,"")}?text=Hi ${selected.customer_name}, your quote for ${selected.product_name}:`}
                  target="_blank" className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-full">💬 WhatsApp</a>
                <a href={`mailto:${selected.customer_email}?subject=Your quote for ${selected.product_name} — Angela`}
                  className="text-xs border border-brand-100 text-brand-600 px-3 py-1.5 rounded-full">📧 Email</a>
                <a href={`tel:${selected.customer_phone}`}
                  className="text-xs border border-brand-100 text-brand-600 px-3 py-1.5 rounded-full">📱 Call</a>
              </div>
            </div>

            {/* Items breakdown (from multi-select picker) */}
            {(() => {
              const itemsMatch = selected.description.match(/Items requested \(\d+\):\n((?:• .+\n?)+)/);
              if (!itemsMatch) return null;
              const lines = itemsMatch[1].split("\n").filter(Boolean);
              const groupColors: Record<string, string> = {
                bundle:  "bg-purple-50 text-purple-800 border-purple-200",
                service: "bg-emerald-50 text-emerald-800 border-emerald-200",
                custom:  "bg-amber-50 text-amber-800 border-amber-200",
                product: "bg-blue-50 text-blue-800 border-blue-200",
              };
              return (
                <div className="border border-brand-100 rounded-xl p-4">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-brand-500 mb-2.5">
                    {lines.length} items requested
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {lines.map((line, i) => {
                      const match = line.match(/• (.+) \((bundle|service|product|custom)\)/);
                      if (!match) return null;
                      const [, itemName, group] = match;
                      return (
                        <span key={i} className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${groupColors[group] ?? "bg-gray-50"}`}>
                          {itemName}
                          <span className="text-[9px] uppercase opacity-60">{group}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="bg-brand-50 rounded-xl p-4 space-y-2">
              {[
                { label: "Product",  value: selected.product_name },
                { label: "Quantity", value: selected.quantity },
                { label: "Timeline", value: selected.timeline ?? "Flexible" },
                { label: "Email",    value: selected.customer_email },
                { label: "Phone",    value: selected.customer_phone },
                ...(selected.company ? [{ label: "Company", value: selected.company }] : []),
                ...(selected.design_file_name ? [{ label: "Design", value: selected.design_file_name }] : []),
              ].map((row) => (
                <div key={row.label} className="flex gap-3">
                  <span className="text-xs text-brand-400 w-20 shrink-0">{row.label}</span>
                  <span className="text-xs text-brand-800 font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-brand-50 rounded-xl p-4">
              <p className="text-xs text-brand-400 mb-1">Customer&apos;s notes</p>
              <p className="text-xs text-brand-800 leading-relaxed whitespace-pre-wrap">
                {/* Strip the items breakdown — already shown above */}
                {selected.description
                  .replace(/Items requested \(\d+\):\n(?:• .+\n?)+/g, "")
                  .replace(/Customer description:\n/g, "")
                  .trim() || "(no extra notes)"}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-brand-700 block mb-1.5">Quote amount (KES)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-2.5 outline-none text-brand-800" />
            </div>

            <div>
              <label className="text-xs font-medium text-brand-700 block mb-1.5">Internal notes</label>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Price includes design, delivery extra…"
                className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-2.5 outline-none resize-none text-brand-800 placeholder:text-brand-300" />
            </div>

            {msg && <p className="text-xs text-brand-600">{msg}</p>}

            <div className="flex gap-3">
              <button onClick={() => handleSave("quoted")} disabled={saving}
                className="flex-1 py-3 bg-brand-700 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium rounded-full transition-colors">
                {saving ? "Saving…" : "Mark as quoted"}
              </button>
              <button onClick={() => handleSave("declined")} disabled={saving}
                className="py-3 px-5 border border-red-200 text-red-500 hover:bg-red-50 text-sm rounded-full transition-colors">
                Decline
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-brand-100 rounded-2xl flex items-center justify-center py-16">
            <div className="text-center">
              <p className="text-3xl mb-3">👈</p>
              <p className="text-sm text-brand-400">Select a quote to review</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

