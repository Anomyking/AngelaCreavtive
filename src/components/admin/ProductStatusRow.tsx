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

export default function ProductStatusRow({ product, currentStatus }: Props) {
  const [stock,    setStock]    = useState<StockStatus>(currentStatus?.stock_status ?? "in_stock");
  const [hidden,   setHidden]   = useState<boolean>(currentStatus?.is_hidden ?? false);
  const [pending,  startTransition] = useTransition();
  const [savedAt,  setSavedAt]  = useState<number | null>(null);

  const update = (changes: { stock_status?: StockStatus; is_hidden?: boolean }) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: product.id, ...changes }),
        });
        if (res.ok) setSavedAt(Date.now());
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

  const showSaved = savedAt && Date.now() - savedAt < 2000;

  return (
    <tr className={`border-b border-slate-100 last:border-0 ${hidden ? "opacity-50" : ""}`}>
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-slate-900">{product.name}</p>
        <p className="text-xs text-slate-400 mt-0.5 font-mono">{product.id}</p>
      </td>
      <td className="px-4 py-3">
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
          product.pricingType === "fixed"
            ? "bg-blue-50 text-blue-700"
            : "bg-purple-50 text-purple-700"
        }`}>
          {product.pricingType === "fixed" ? "Fixed" : "Quote"}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-slate-700">
        {product.basePrice ? `KES ${product.basePrice.toLocaleString()}` : "—"}
        {product.priceUnit && <span className="text-xs text-slate-400 ml-1">{product.priceUnit}</span>}
      </td>
      <td className="px-4 py-3">
        <select
          value={stock}
          onChange={(e) => handleStock(e.target.value as StockStatus)}
          disabled={pending}
          className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer ${statusOptions.find(o => o.value === stock)?.classes}`}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-slate-900">{opt.label}</option>
          ))}
        </select>
        {showSaved && <span className="text-[10px] text-emerald-600 ml-2">✓ saved</span>}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={handleHide}
          disabled={pending}
          className={`relative w-9 h-5 rounded-full transition-colors ${hidden ? "bg-slate-300" : "bg-emerald-500"}`}
        >
          <span className={`absolute top-0.5 ${hidden ? "left-0.5" : "left-[18px]"} w-4 h-4 bg-white rounded-full shadow transition-all`} />
        </button>
      </td>
    </tr>
  );
}

