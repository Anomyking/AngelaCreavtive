"use client";

import { useState, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { formatPrice } from "@/data";
import ProductImage from "@/components/product/ProductImage";
import StockBadge from "@/components/product/StockBadge";

// Quantity options with pricing tiers
const QTY_OPTIONS = [50, 100, 250, 500, 1000, 2500, 5000];

// Finish options common to most print products
const FINISH_OPTIONS = [
  { id: "gloss",     label: "Gloss",      modifier: 0    },
  { id: "matte",     label: "Matte",      modifier: 200  },
  { id: "soft-touch",label: "Soft touch", modifier: 500  },
];

function getQtyMultiplier(qty: number): number {
  // Bulk discount tiers
  if (qty >= 5000) return 0.55;
  if (qty >= 2500) return 0.65;
  if (qty >= 1000) return 0.75;
  if (qty >= 500)  return 0.85;
  if (qty >= 250)  return 0.92;
  return 1;
}

interface Props { product: Product; }

export default function ProductClient({ product }: Props) {
  const [quantity,     setQuantity]     = useState(product.pricingType === "fixed" ? 100 : 1);
  const [finish,       setFinish]       = useState("gloss");
  const [designFile,   setDesignFile]   = useState<File | null>(null);
  const [notes,        setNotes]        = useState("");
  const { addItem } = useCart();
  const [added,        setAdded]        = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteForm,    setQuoteForm]    = useState({ name: "", email: "", phone: "", company: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  const isFixed = product.pricingType === "fixed";
  const basePrice = product.basePrice ?? 0;
  const finishMod = FINISH_OPTIONS.find((f) => f.id === finish)?.modifier ?? 0;

  // Price calculation
  const unitPrice   = (basePrice + finishMod) * getQtyMultiplier(quantity);
  const totalPrice  = Math.round(unitPrice * (quantity / 100)); // base is per 100
  const savings     = Math.round((basePrice * quantity / 100) - totalPrice);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setDesignFile(e.target.files[0]);
  };

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      finish,
      unitPrice: Math.round(unitPrice),
      notes:     notes || undefined,
      designFileName: designFile?.name,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError,   setQuoteError]   = useState("");

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteLoading(true);
    setQuoteError("");
    try {
      const res = await fetch("/api/quote", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:            quoteForm.name,
          email:           quoteForm.email,
          phone:           quoteForm.phone,
          company:         quoteForm.company,
          product:         product.name,
          quantity:        notes,
          description:     notes,
          designFileName:  designFile?.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed");
      setQuoteSuccess(true);
    } catch (err: unknown) {
      setQuoteError(err instanceof Error ? err.message : "Something went wrong. Please try WhatsApp.");
    } finally {
      setQuoteLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

      {/* ── LEFT: Product image + details ── */}
      <div>
        {/* Main image area */}
        <div className="bg-brand-50 border border-brand-100 rounded-3xl aspect-square mb-6 relative overflow-hidden">
          <ProductImage productId={product.id} productName={product.name} size="detail" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isPopular && (
              <span className="text-xs font-medium bg-brand-700 text-white rounded-full px-3 py-1.5">
                ⭐ Most popular
              </span>
            )}
            {product.isSameDay && (
              <span className="text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full px-3 py-1.5">
                ⚡ Same-day available
              </span>
            )}
            {product.isNew && (
              <span className="text-xs font-medium bg-brand-100 text-brand-700 rounded-full px-3 py-1.5">
                ✨ New
              </span>
            )}
          </div>

          {/* Replace emoji with real photo — swap this div for <Image> */}
          <p className="absolute bottom-4 right-4 text-[10px] text-brand-300 bg-white/70 rounded-full px-2 py-1">
            Photo coming soon
          </p>
        </div>

        {/* Product info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-500 bg-brand-50 border border-brand-100 rounded-full px-3 py-1">
              ⏱ {product.turnaround}
            </span>
            {product.priceUnit && (
              <span className="text-xs text-brand-500 bg-brand-50 border border-brand-100 rounded-full px-3 py-1">
                📦 Min. order: {product.priceUnit.replace("per ", "")}
              </span>
            )}
          </div>

          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 space-y-3">
            <p className="text-sm font-medium text-brand-900">What&apos;s included</p>
            {[
              "Free pre-print digital proof via email",
              "Professional colour management (CMYK)",
              "Quality check before dispatch",
              product.isSameDay ? "Same-day printing if ordered before 12 PM" : "Standard turnaround: " + product.turnaround,
              "Free delivery on orders over KES 7,000",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <span className="text-brand-500 mt-0.5 shrink-0">✓</span>
                <span className="text-xs text-brand-600">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-xs font-medium text-amber-800 mb-1">📐 Design guidelines</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Please send files in PDF, AI, or PSD format at 300 DPI with 3mm bleed. Not sure?{" "}
              <a href="/templates" className="underline font-medium">Download our free templates →</a>
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Order / Quote form ── */}
      <div>
        <h1 className="text-2xl font-medium text-brand-950 mb-1">{product.name}</h1>
        <p className="text-sm text-brand-500 leading-relaxed mb-6">{product.description}</p>

        <StockBadge productId={product.id} size="detail" />

        {isFixed ? (
          /* ── FIXED PRICE ORDER FORM ── */
          <div className="space-y-6">

            {/* Quantity selector */}
            <div>
              <label className="text-xs font-medium text-brand-700 uppercase tracking-wider block mb-3">
                Quantity
              </label>
              <div className="grid grid-cols-4 gap-2">
                {QTY_OPTIONS.map((qty) => (
                  <button
                    key={qty}
                    onClick={() => setQuantity(qty)}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      quantity === qty
                        ? "bg-brand-700 text-white border-brand-700"
                        : "bg-white text-brand-600 border-brand-100 hover:border-brand-400"
                    }`}
                  >
                    {qty.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Finish selector */}
            <div>
              <label className="text-xs font-medium text-brand-700 uppercase tracking-wider block mb-3">
                Finish
              </label>
              <div className="flex gap-2">
                {FINISH_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFinish(f.id)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      finish === f.id
                        ? "bg-brand-700 text-white border-brand-700"
                        : "bg-white text-brand-600 border-brand-100 hover:border-brand-400"
                    }`}
                  >
                    {f.label}
                    {f.modifier > 0 && (
                      <span className={`block text-[10px] mt-0.5 ${finish === f.id ? "text-brand-300" : "text-brand-400"}`}>
                        +{formatPrice(f.modifier)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price display */}
            <div className="bg-brand-950 rounded-2xl p-5">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-xs text-brand-500 mb-1">Total price</p>
                  <p className="text-3xl font-medium text-brand-300">{formatPrice(totalPrice)}</p>
                  <p className="text-xs text-brand-600 mt-1">
                    {formatPrice(Math.round(totalPrice / quantity * 100))} per 100 pieces
                  </p>
                </div>
                {savings > 0 && (
                  <div className="text-right">
                    <span className="text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-800 rounded-full px-3 py-1.5 font-medium">
                      You save {formatPrice(savings)}
                    </span>
                  </div>
                )}
              </div>
              <div className="h-px bg-brand-800 my-3" />
              <p className="text-xs text-brand-600">
                Price includes VAT · Free delivery over KES 7,000
              </p>
            </div>

            {/* Design upload */}
            <div>
              <label className="text-xs font-medium text-brand-700 uppercase tracking-wider block mb-3">
                Upload your design <span className="text-brand-400 normal-case font-normal">(optional — add later)</span>
              </label>
              <div
                className="border-2 border-dashed border-brand-100 hover:border-brand-400 rounded-2xl p-6 text-center cursor-pointer transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {designFile ? (
                  <div>
                    <p className="text-sm font-medium text-brand-700">✅ {designFile.name}</p>
                    <p className="text-xs text-brand-400 mt-1">{(designFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-2xl mb-2">📎</p>
                    <p className="text-sm text-brand-600 font-medium">Drop your file here or click to browse</p>
                    <p className="text-xs text-brand-400 mt-1">PDF, AI, PSD, PNG, JPG — max 50MB</p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.ai,.psd,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-brand-700 uppercase tracking-wider block mb-2">
                Special instructions <span className="text-brand-400 normal-case font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g. double-sided printing, specific colours, packaging notes…"
                className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl p-4 outline-none resize-none text-brand-800 placeholder:text-brand-300"
              />
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-full text-sm font-medium transition-all ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-brand-700 hover:bg-brand-600 text-white"
              }`}
            >
              {added ? "✅ Added to cart!" : `Add to cart — ${formatPrice(totalPrice)}`}
            </button>

            <div className="flex gap-3">
              <a
                href="https://wa.me/254700000000"
                className="flex-1 py-3 rounded-full text-sm font-medium border border-brand-100 hover:border-brand-300 text-brand-600 text-center transition-colors"
              >
                💬 Order via WhatsApp
              </a>
              <a
                href="/quote"
                className="flex-1 py-3 rounded-full text-sm font-medium border border-brand-100 hover:border-brand-300 text-brand-600 text-center transition-colors"
              >
                📋 Request a quote
              </a>
            </div>
          </div>

        ) : (
          /* ── QUOTE REQUEST FORM ── */
          <div>
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-6">
              <p className="text-sm font-medium text-brand-900 mb-1">💬 This product is custom-quoted</p>
              <p className="text-xs text-brand-600 leading-relaxed">
                Pricing depends on your size, quantity, and specifications. Fill in the form below and we&apos;ll send you a quote within 1 hour during business hours.
              </p>
            </div>

            {quoteSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <p className="text-3xl mb-3">🎉</p>
                <p className="text-base font-medium text-emerald-800 mb-2">Quote request received!</p>
                <p className="text-sm text-emerald-700">We&apos;ll email you a detailed quote within 1 hour. Check your inbox at {quoteForm.email}</p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-brand-700 block mb-1.5">Your name *</label>
                    <input required value={quoteForm.name} onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-800 placeholder:text-brand-300"
                      placeholder="Jane Mwangi" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-brand-700 block mb-1.5">Company</label>
                    <input value={quoteForm.company} onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                      className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-800 placeholder:text-brand-300"
                      placeholder="Optional" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-700 block mb-1.5">Email address *</label>
                  <input required type="email" value={quoteForm.email} onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                    className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-800 placeholder:text-brand-300"
                    placeholder="jane@company.co.ke" />
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-700 block mb-1.5">Phone / WhatsApp *</label>
                  <input required value={quoteForm.phone} onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none text-brand-800 placeholder:text-brand-300"
                    placeholder="+254 700 000 000" />
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-700 block mb-1.5">Quantity & specifications *</label>
                  <textarea required rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-3 outline-none resize-none text-brand-800 placeholder:text-brand-300"
                    placeholder="E.g. 500 pieces, 2m × 3m, full colour both sides, need by Friday…" />
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-700 block mb-2">Upload design / reference (optional)</label>
                  <div className="border-2 border-dashed border-brand-100 hover:border-brand-400 rounded-xl p-4 text-center cursor-pointer transition-colors"
                    onClick={() => fileRef.current?.click()}>
                    {designFile
                      ? <p className="text-sm text-brand-700 font-medium">✅ {designFile.name}</p>
                      : <p className="text-sm text-brand-500">📎 Click to attach file</p>}
                    <input ref={fileRef} type="file" accept=".pdf,.ai,.psd,.png,.jpg,.jpeg,.zip" className="hidden" onChange={handleFileChange} />
                  </div>
                </div>
                {quoteError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <p className="text-xs text-red-600">❌ {quoteError}</p>
                  </div>
                )}
                <button type="submit" disabled={quoteLoading}
                  className="w-full py-4 rounded-full bg-brand-700 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  {quoteLoading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
                    : "Send quote request →"}
                </button>
                <p className="text-center text-xs text-brand-400">We reply within 1 hour · Mon – Sat, 8 AM – 6 PM</p>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

