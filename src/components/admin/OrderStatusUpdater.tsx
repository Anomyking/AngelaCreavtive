"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DBOrder, OrderStatus } from "@/lib/db";

const allStatuses: OrderStatus[] = ["pending","confirmed","printing","ready","dispatched","delivered","cancelled"];

const statusLabels: Record<OrderStatus, string> = {
  pending:    "⏳ Pending",
  confirmed:  "✅ Confirmed",
  printing:   "🖨️ Printing",
  ready:      "🎉 Ready",
  dispatched: "🚚 Dispatched",
  delivered:  "📦 Delivered",
  cancelled:  "❌ Cancelled",
};

export default function OrderStatusUpdater({ order }: { order: DBOrder }) {
  const [status,       setStatus]       = useState<OrderStatus>(order.status);
  const [trackingCode, setTrackingCode] = useState(order.tracking_code ?? "");
  const [loading,      setLoading]      = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [error,        setError]        = useState("");
  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/status", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          reference:     order.reference,
          status,
          tracking_code: trackingCode || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Update failed");

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const needsTracking = ["dispatched", "delivered"].includes(status);
  const willSendEmail = ["printing","ready","dispatched","delivered"].includes(status);

  return (
    <div className="bg-white border border-brand-100 rounded-2xl p-5">
      <h2 className="text-sm font-medium text-brand-950 mb-4">Update order status</h2>

      <div className="space-y-4">
        {/* Status selector */}
        <div>
          <label className="text-xs font-medium text-brand-600 block mb-2">New status</label>
          <div className="grid grid-cols-2 gap-2">
            {allStatuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                  status === s
                    ? "bg-brand-700 text-white border-brand-700"
                    : "bg-white text-brand-600 border-brand-100 hover:border-brand-300"
                }`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking code */}
        {needsTracking && (
          <div>
            <label className="text-xs font-medium text-brand-600 block mb-2">
              Tracking code {status === "dispatched" ? "*" : "(optional)"}
            </label>
            <input
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="e.g. G4S-12345, DHL-67890"
              className="w-full text-sm border border-brand-100 focus:border-brand-500 rounded-xl px-4 py-2.5 outline-none text-brand-800 placeholder:text-brand-300"
            />
          </div>
        )}

        {/* Email warning */}
        {willSendEmail && status !== order.status && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-700">
              📧 A status update email will be sent to{" "}
              <strong>{order.customer_email}</strong> when you save.
            </p>
          </div>
        )}

        {/* Feedback */}
        {error   && <p className="text-xs text-red-500">❌ {error}</p>}
        {success && <p className="text-xs text-emerald-600">✅ Status updated{willSendEmail ? " and email sent" : ""}!</p>}

        {/* Save button */}
        <button
          onClick={handleUpdate}
          disabled={loading || status === order.status}
          className="w-full py-3 bg-brand-700 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-2"
        >
          {loading
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating…</>
            : status === order.status ? "No changes to save" : `Save — mark as ${statusLabels[status]}`}
        </button>
      </div>
    </div>
  );
}

