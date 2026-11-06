"use client";

import { useState, useTransition } from "react";
import { Product } from "@/types";
import type { DBProductStatus, StockStatus } from "@/lib/db";

interface Props {
  product: Product;
  currentStatus?: DBProductStatus;
}

const statusOptions: { value: StockStatus; label: string; classes: string }[] = [
  { value: "in_stock",     label: "In stock",     classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "low_stock",    label: "Low stock",    classes: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "out_of_stock", label: "Out of stock", classes: "bg-red-50 text-red-700 border-red-200" },
];

/**
 * One product row.
 *  - Phones: a compact card — name + visibility switch on top, type/price below, stock select full width.
 *  - md and up: a grid row whose columns line up with the header in products/page.tsx.
 *    (Keep the md:grid-cols-[…] template identical in both files.)
 */
export default function ProductStatusRow({ product, currentStatus }: Props) {
  const [stock,   setStock]   = useState<StockStatus>(currentStatus?.stock_status ?? "in_stock");
  const [hidden,  setHidden]  = useState<boolean>(currentStatus?.is_hidden ?? false);
  const [pending, startTransition] = useTransition();
  const [saved,   setSaved]   = useState(false);

  const update = (changes: { stock_status?: StockStatus; is_hidden?: boolean }) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: product.id, ...changes }),
        });
        if (res.ok) {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      } catch { /* ignore */ }
    });
  };

  const handleStock = (value: StockStatus) => {
    setStock(value);
    update({ stock_status: value });
  };

  const handleHide = () => {
    const next = !hidden;
    setHidden(next);
    update({ is_hidden: next });
  };

  return (
    <div
      className={`px-4 py-3 border-b border-slate-100 last:border-0 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2.5 md:grid-cols-[minmax(0,2fr)_80px_minmax(0,1fr)_190px_64px] md:gap-x-4 ${hidden ? "opacity-50" : ""}`}
    >
      {/* Name */}
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900 break-words">{product.name}</p>
        <p className="text-xs text-slate-400 mt-0.5 font-mono break-all">{product.id}</p>
      </div>

      {/* Type + price: one row on phones, two grid columns from md (md:contents) */}
      <div className="col-span-2 flex flex-wrap items-center gap-x-3 gap-y-1 md:contents">
        <div>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
            product.pricingType === "fixed"
              ? "bg-blue-50 text-blue-700"
              : "bg-purple-50 text-purple-700"
          }`}>
            {product.pricingType === "fixed" ? "Fixed" : "Quote"}
          </span>
        </div>
        <div className="text-sm text-slate-700">
          {product.basePrice ? `KES ${product.basePrice.toLocaleString()}` : "—"}
          {product.priceUnit && <span className="text-xs text-slate-400 ml-1">{product.priceUnit}</span>}
        </div>
      </div>

      {/* Stock status */}
      <div className="col-span-2 flex items-center gap-2 md:col-span-1">
        <select
          value={stock}
          onChange={(e) => handleStock(e.target.value as StockStatus)}
          disabled={pending}
          aria-label={`Stock status for ${product.name}`}
          className={`flex-1 md:flex-none md:w-[120px] text-xs font-medium px-2.5 py-2.5 md:py-1.5 rounded-lg border outline-none cursor-pointer ${statusOptions.find(o => o.value === stock)?.classes}`}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-slate-900">{opt.label}</option>
          ))}
        </select>
        {saved && <span className="text-[10px] text-emerald-600 shrink-0">✓ saved</span>}
      </div>

      {/* Visible switch: top-right on phones (explicit grid position), last column from md */}
      <div className="col-start-2 row-start-1 md:col-auto md:row-auto flex justify-end md:justify-start">
        <button
          type="button"
          role="switch"
          aria-checked={!hidden}
          aria-label={`${hidden ? "Show" : "Hide"} ${product.name} on the website`}
          onClick={handleHide}
          disabled={pending}
          className={`relative w-9 h-5 rounded-full transition-colors before:absolute before:-inset-2 ${hidden ? "bg-slate-300" : "bg-emerald-500"}`}
        >
          <span className={`absolute top-0.5 ${hidden ? "left-0.5" : "left-[18px]"} w-4 h-4 bg-white rounded-full shadow transition-all`} />
        </button>
      </div>
    </div>
  );
}
