"use client";

import { useState, useEffect } from "react";

interface Props {
  productId: string;
  /** "card" = small pill, "detail" = full banner */
  size?: "card" | "detail";
}

type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

const statusConfig: Record<StockStatus, { label: string; bg: string; text: string; emoji: string }> = {
  in_stock:     { label: "In stock",     bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", emoji: "✓" },
  low_stock:    { label: "Low stock",    bg: "bg-amber-50 border-amber-200",     text: "text-amber-700",   emoji: "⚠️" },
  out_of_stock: { label: "Out of stock", bg: "bg-red-50 border-red-200",         text: "text-red-700",     emoji: "✕" },
};

// Module-level cache so we only fetch once per page load
let cache: Record<string, StockStatus> | null = null;
let cachePromise: Promise<Record<string, StockStatus>> | null = null;

async function loadStatuses(): Promise<Record<string, StockStatus>> {
  if (cache) return cache;
  if (cachePromise) return cachePromise;
  cachePromise = fetch("/api/admin/products").then(async (r) => {
    if (!r.ok) return {};
    const { statuses } = await r.json();
    const map: Record<string, StockStatus> = {};
    for (const s of statuses ?? []) map[s.product_id] = s.stock_status;
    cache = map;
    return map;
  }).catch(() => ({}));
  return cachePromise;
}

export default function StockBadge({ productId, size = "card" }: Props) {
  const [status, setStatus] = useState<StockStatus>("in_stock");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    loadStatuses().then((m) => {
      if (!active) return;
      setStatus(m[productId] ?? "in_stock");
      setLoaded(true);
    });
    return () => { active = false; };
  }, [productId]);

  if (!loaded || status === "in_stock") return null;
  const cfg = statusConfig[status];

  if (size === "detail") {
    return (
      <div className={`${cfg.bg} ${cfg.text} border rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 mb-4`}>
        <span>{cfg.emoji}</span>
        <span>
          {status === "out_of_stock"
            ? "Currently out of stock — please request a quote or contact us for ETA"
            : "Limited stock — order soon"}
        </span>
      </div>
    );
  }

  return (
    <span className={`text-[9px] font-medium ${cfg.bg} ${cfg.text} border rounded-full px-2 py-0.5`}>
      {cfg.emoji} {cfg.label}
    </span>
  );
}

