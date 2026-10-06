"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products, bundles, categories } from "@/data";

// Featured items shown at the top of the picker
const services = [
  { id: "svc-signage", name: "Signage & branding", group: "service", note: "3D LED, vehicle wraps, neon, pylon signage" },
  { id: "svc-graphic", name: "Graphic design",  group: "service", note: "Logos, brand identity, social media" },
  { id: "svc-web",     name: "Web design",       group: "service", note: "Websites, e-commerce, M-Pesa setup" },
];

type Picked = { id: string; name: string; group: "bundle" | "service" | "product" | "custom" };

function QuoteFormInner() {
  const params       = useSearchParams();
  const preBundleId  = params.get("bundle");
  const preService   = params.get("service");

  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    quantity: "", description: "", timeline: "",
  });

  // Pre-fill items if URL provided ?bundle=... or ?service=design/web
  const [picked, setPicked] = useState<Picked[]>(() => {
    const initial: Picked[] = [];
    if (preBundleId) {
      const b = bundles.find((x) => x.id === preBundleId);
      if (b) initial.push({ id: `bundle-${b.id}`, name: `${b.name} (Bundle)`, group: "bundle" });
    }
    if (preService === "design") initial.push({ id: "svc-graphic", name: "Graphic design", group: "service" });
    if (preService === "web")    initial.push({ id: "svc-web",     name: "Web design",     group: "service" });
    if (preService === "signage") initial.push({ id: "svc-signage", name: "Signage & branding", group: "service" });
    return initial;
  });
  const [customItem,  setCustomItem]  = useState("");
  const [pickerQuery, setPickerQuery] = useState("");

  const [file,    setFile]    = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // Search filtering inside picker
  const filteredProducts = useMemo(() => {
    if (!pickerQuery.trim()) return products;
    const q = pickerQuery.toLowerCase().trim();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.categoryId.toLowerCase().includes(q)
    );
  }, [pickerQuery]);

  const togglePick = (item: Picked) => {
    setPicked((prev) =>
      prev.some((p) => p.id === item.id)
        ? prev.filter((p) => p.id !== item.id)
        : [...prev, item]
    );
  };

  const isPicked = (id: string) => picked.some((p) => p.id === id);

  const addCustom = () => {
    const txt = customItem.trim();
    if (!txt) return;
    const id = `custom-${Date.now()}`;
    setPicked((prev) => [...prev, { id, name: txt, group: "custom" }]);
    setCustomItem("");
  };

  const removePick = (id: string) =>
    setPicked((prev) => prev.filter((p) => p.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (picked.length === 0) {
      setError("Please select at least one product, bundle, or service.");
      return;
    }
    setLoading(true);
    try {
      const itemNames = picked.map((p) => p.name).join(", ");
      const res = await fetch("/api/quote", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          product:        itemNames,           // legacy single-field for compat
          items:          picked,              // new multi-select array
          designFileName: file?.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Submission failed");
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <p className="text-5xl mb-6">🎉</p>
          <h1 className="text-2xl font-medium text-brand-950 mb-3">Quote request sent!</h1>
          <p className="text-sm text-brand-600 leading-relaxed mb-2">
            Thanks {form.name}. We&apos;ve received your request for{" "}
            <strong>{picked.length} item{picked.length === 1 ? "" : "s"}</strong> and will send
            a detailed quote to <strong>{form.email}</strong> within 1 hour during business hours.
          </p>
          <p className="text-xs text-brand-400 mb-8">Reference number sent to your email</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="/" className="inline-flex bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-full">Back to home</a>
            <a href="https://wa.me/254700000000" className="inline-flex border border-brand-100 hover:border-brand-300 text-brand-600 text-sm px-5 py-2.5 rounded-full">WhatsApp us</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-950 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-600 mb-3">Custom orders</p>
          <h1 className="text-2xl sm:text-3xl font-medium text-brand-300 mb-2">Get a free quote</h1>
          <p className="text-sm text-brand-600">
            Pick one or more items — bundles, products, or services. We&apos;ll send a detailed quote within 1 hour during business hours.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Customer details */}
          <div className="bg-white border border-brand-100 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-medium text-brand-950">Your details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-brand-700 block mb-1.5">Full name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Mwangi"
                  className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-2.5 outline-none text-brand-800 placeholder:text-brand-300" />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-700 block mb-1.5">Company</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Optional"
                  className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-2.5 outline-none text-brand-800 placeholder:text-brand-300" />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-700 block mb-1.5">Email *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@company.co.ke"
                  className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-2.5 outline-none text-brand-800 placeholder:text-brand-300" />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-700 block mb-1.5">Phone / WhatsApp *</label>
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+254 700 000 000"
                  className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-2.5 outline-none text-brand-800 placeholder:text-brand-300" />
              </div>
            </div>
          </div>

          {/* Item picker — bundles + services at top */}
          <div className="bg-white border border-brand-100 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-50 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-brand-950">What do you need?</h2>
                <p className="text-xs text-brand-500 mt-0.5">Pick as many as you want — we&apos;ll quote everything together</p>
              </div>
              {picked.length > 0 && (
                <span className="text-[11px] font-medium bg-brand-700 text-white rounded-full px-2.5 py-1">
                  {picked.length} selected
                </span>
              )}
            </div>

            {/* Highlighted bundles & services */}
            <div className="p-5 bg-gradient-to-br from-brand-50 to-white border-b border-brand-100">
              <p className="text-[10px] font-medium uppercase tracking-widest text-brand-500 mb-3 flex items-center gap-2">
                <span>⭐ Bundles & services</span>
                <span className="text-brand-400 normal-case tracking-normal font-normal">— most popular picks</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {bundles.map((b) => {
                  const id = `bundle-${b.id}`;
                  const checked = isPicked(id);
                  return (
                    <button type="button" key={id}
                      onClick={() => togglePick({ id, name: `${b.name} (Bundle)`, group: "bundle" })}
                      className={`flex items-start gap-3 text-left rounded-xl border p-3 transition-all ${
                        checked
                          ? "border-brand-600 bg-brand-50 shadow-sm"
                          : "border-brand-100 hover:border-brand-400 bg-white"
                      }`}
                    >
                      <span className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        checked ? "bg-brand-700 border-brand-700 text-white" : "border-brand-300"
                      }`}>
                        {checked && <span className="text-[10px]">✓</span>}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-xs font-medium text-brand-900 truncate">{b.name}</p>
                          {b.isPopular && (
                            <span className="text-[9px] bg-brand-700 text-white px-1.5 py-0.5 rounded">Popular</span>
                          )}
                        </div>
                        <p className="text-[11px] text-brand-500 truncate">{b.tagline}</p>
                        <p className="text-[10px] text-brand-700 font-medium mt-1">KES {b.priceKES.toLocaleString()}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {services.map((s) => {
                  const checked = isPicked(s.id);
                  return (
                    <button type="button" key={s.id}
                      onClick={() => togglePick({ id: s.id, name: s.name, group: "service" })}
                      className={`flex items-start gap-3 text-left rounded-xl border p-3 transition-all ${
                        checked
                          ? "border-brand-600 bg-brand-50 shadow-sm"
                          : "border-brand-100 hover:border-brand-400 bg-white"
                      }`}
                    >
                      <span className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        checked ? "bg-brand-700 border-brand-700 text-white" : "border-brand-300"
                      }`}>
                        {checked && <span className="text-[10px]">✓</span>}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-brand-900 truncate flex items-center gap-1.5">
                          {s.name}
                          <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Service</span>
                        </p>
                        <p className="text-[11px] text-brand-500 truncate mt-0.5">{s.note}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* All products with search */}
            <div className="p-5 border-b border-brand-100">
              <p className="text-[10px] font-medium uppercase tracking-widest text-brand-500 mb-3">All products</p>
              <input
                value={pickerQuery}
                onChange={(e) => setPickerQuery(e.target.value)}
                placeholder="Search products by name…"
                className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-2.5 outline-none text-brand-800 placeholder:text-brand-300 mb-3"
              />
              <div className="max-h-72 overflow-y-auto pr-1 space-y-3">
                {categories.map((cat) => {
                  const catItems = filteredProducts.filter((p) => p.categoryId === cat.id);
                  if (catItems.length === 0) return null;
                  return (
                    <div key={cat.id}>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-brand-400 mb-1.5 px-1">
                        {cat.name}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {catItems.map((p) => {
                          const checked = isPicked(p.id);
                          return (
                            <button type="button" key={p.id}
                              onClick={() => togglePick({ id: p.id, name: p.name, group: "product" })}
                              className={`flex items-center gap-2 text-left rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                                checked
                                  ? "bg-brand-50 text-brand-900 border border-brand-600"
                                  : "hover:bg-brand-50 text-brand-700 border border-transparent"
                              }`}
                            >
                              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                checked ? "bg-brand-700 border-brand-700 text-white" : "border-brand-300"
                              }`}>
                                {checked && <span className="text-[9px]">✓</span>}
                              </span>
                              <span className="truncate">{p.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <p className="text-xs text-brand-400 text-center py-4">No products match &quot;{pickerQuery}&quot;</p>
                )}
              </div>
            </div>

            {/* Custom item */}
            <div className="p-5 bg-brand-50/50">
              <p className="text-[10px] font-medium uppercase tracking-widest text-brand-500 mb-2">Not listed? Add custom item</p>
              <div className="flex gap-2">
                <input value={customItem} onChange={(e) => setCustomItem(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
                  placeholder="e.g. Branded umbrellas, neon signs…"
                  className="flex-1 text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-2.5 outline-none text-brand-800 placeholder:text-brand-300 bg-white" />
                <button type="button" onClick={addCustom} disabled={!customItem.trim()}
                  className="bg-brand-700 hover:bg-brand-600 disabled:opacity-40 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-colors">
                  Add
                </button>
              </div>
            </div>

            {/* Selected items recap */}
            {picked.length > 0 && (
              <div className="p-5 border-t border-brand-100 bg-white">
                <p className="text-[10px] font-medium uppercase tracking-widest text-brand-500 mb-2">
                  Selected items ({picked.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {picked.map((p) => (
                    <span key={p.id} className={`inline-flex items-center gap-1.5 text-xs rounded-full pl-3 pr-1 py-1 border ${
                      p.group === "bundle"  ? "bg-purple-50 text-purple-800 border-purple-200" :
                      p.group === "service" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                      p.group === "custom"  ? "bg-amber-50 text-amber-800 border-amber-200" :
                                              "bg-brand-50 text-brand-800 border-amber-200"
                    }`}>
                      {p.name}
                      <button type="button" onClick={() => removePick(p.id)}
                        className="w-4 h-4 rounded-full bg-white/60 hover:bg-white text-current flex items-center justify-center text-[10px]">
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity + timeline */}
          <div className="bg-white border border-brand-100 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-medium text-brand-950">Quantities & timing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-brand-700 block mb-1.5">Total quantity / scope *</label>
                <input required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  placeholder="E.g. 500 cards + 100 flyers"
                  className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-2.5 outline-none text-brand-800 placeholder:text-brand-300" />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-700 block mb-1.5">When do you need it?</label>
                <select value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                  className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-2.5 outline-none text-brand-800 bg-white">
                  <option value="">Flexible</option>
                  <option value="urgent">Today / Tomorrow (urgent)</option>
                  <option value="3days">Within 3 days</option>
                  <option value="1week">Within 1 week</option>
                  <option value="2weeks">Within 2 weeks</option>
                  <option value="flexible">No rush</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-brand-700 block mb-1.5">Specifications & extra details *</label>
              <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Sizes, colours, finishes, deadlines, delivery address — anything that helps us quote accurately"
                className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-2.5 outline-none resize-none text-brand-800 placeholder:text-brand-300" />
            </div>

            <div>
              <label className="text-xs font-medium text-brand-700 block mb-2">Attach design / reference (optional)</label>
              <div className="border-2 border-dashed border-brand-100 hover:border-brand-400 rounded-xl p-5 text-center cursor-pointer transition-colors"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {file ? (
                  <p className="text-sm font-medium text-brand-700">✅ {file.name}</p>
                ) : (
                  <>
                    <p className="text-2xl mb-2">📎</p>
                    <p className="text-sm text-brand-600 font-medium">Click to attach file</p>
                    <p className="text-xs text-brand-400 mt-1">PDF, AI, PSD, PNG, JPG, ZIP — max 50MB</p>
                  </>
                )}
                <input id="file-upload" type="file" className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              ❌ {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-brand-700 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium px-6 py-4 rounded-full transition-colors flex items-center justify-center gap-2">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending request…</>
            ) : (
              <>Request quote for {picked.length || "selected items"} →</>
            )}
          </button>

          <p className="text-xs text-center text-brand-400">
            Quote arrives within 1 hour during business hours · No card needed · No-obligation
          </p>
        </form>
      </div>
    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-brand-500">Loading…</div>}>
      <QuoteFormInner />
    </Suspense>
  );
}

