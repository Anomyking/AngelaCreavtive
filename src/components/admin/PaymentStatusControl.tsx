"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PaymentStatus } from "@/lib/db";

const options: { value: PaymentStatus; label: string; active: string }[] = [
  { value: "pending",  label: "Pending",  active: "bg-amber-500 text-white border-amber-500"     },
  { value: "paid",     label: "Paid",     active: "bg-emerald-600 text-white border-emerald-600" },
  { value: "refunded", label: "Refunded", active: "bg-slate-600 text-white border-slate-600"     },
];

const statusText: Record<PaymentStatus, string> = {
  paid:     "✅ Paid",
  pending:  "⏳ Awaiting payment",
  refunded: "↩️ Refunded",
  failed:   "❌ Failed",
};

const statusColor: Record<PaymentStatus, string> = {
  paid:     "text-emerald-600",
  pending:  "text-yellow-600",
  refunded: "text-slate-500",
  failed:   "text-red-500",
};

/**
 * Lets the admin record payment for an order. The website takes no online
 * payment, so staff arrange it with the customer and mark it here.
 */
export default function PaymentStatusControl({
  reference,
  paymentStatus,
}: {
  reference:     string;
  paymentStatus: PaymentStatus;
}) {
  const [current, setCurrent] = useState<PaymentStatus>(paymentStatus);
  const [saving,  setSaving]  = useState<PaymentStatus | null>(null);
  const [error,   setError]   = useState("");
  const router = useRouter();

  const update = async (next: PaymentStatus) => {
    if (next === current || saving) return;
    setSaving(next);
    setError("");

    try {
      const res = await fetch("/api/admin/status", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ reference, payment_status: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Update failed");

      setCurrent(next);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-3">
      <p className={`text-xs font-medium ${statusColor[current]}`}>{statusText[current]}</p>

      <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Payment status">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => update(opt.value)}
            disabled={saving !== null}
            aria-pressed={current === opt.value}
            className={`min-h-[40px] px-2 rounded-lg border text-xs font-medium transition-colors disabled:opacity-60 ${
              current === opt.value
                ? opt.active
                : "bg-white text-brand-600 border-brand-100 hover:border-brand-300"
            }`}
          >
            {saving === opt.value ? "Saving…" : opt.label}
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-red-500">❌ {error}</p>}
    </div>
  );
}
