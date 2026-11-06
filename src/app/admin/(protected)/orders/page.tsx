import Link from "next/link";
import { getOrders, DBOrder } from "@/lib/db";

const statusColors: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  printing:   "bg-purple-100 text-purple-700",
  ready:      "bg-emerald-100 text-emerald-700",
  dispatched: "bg-cyan-100 text-cyan-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-600",
};

const paymentColors: Record<string, string> = {
  paid:     "text-emerald-600",
  pending:  "text-yellow-600",
  failed:   "text-red-500",
  refunded: "text-slate-500",
};

const paymentIcon: Record<string, string> = {
  paid:     "✅",
  failed:   "❌",
  refunded: "↩️",
  pending:  "⏳",
};

function itemCount(order: DBOrder) {
  const n = Array.isArray(order.items) ? order.items.length : 0;
  return `${n} item${n !== 1 ? "s" : ""}`;
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short" });
}

export default async function OrdersPage() {
  let orders: DBOrder[];
  try {
    orders = await getOrders({ limit: 50 });
  } catch {
    orders = [];
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-brand-950">Orders</h1>
          <p className="text-sm text-brand-500 mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-brand-100 rounded-2xl py-16 text-center">
          <p className="text-4xl mb-3">🛒</p>
          <p className="text-sm font-medium text-brand-600">No orders yet</p>
          <p className="text-xs text-brand-400 mt-1">Orders will appear here once customers checkout</p>
        </div>
      ) : (
        <>
          {/* ── Phones / tablets / small laptops: cards ─────────────────── */}
          {/* grid-cols-1 (= minmax(0,1fr)) stops long names stretching the column past the screen */}
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:hidden">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="block h-full bg-white border border-brand-100 rounded-2xl p-4 hover:border-brand-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-brand-900 truncate">{order.customer_name}</p>
                      <p className="text-xs font-mono font-medium text-brand-700 mt-0.5 truncate">{order.reference}</p>
                    </div>
                    <p className="font-medium text-brand-900 shrink-0">KES {order.total.toLocaleString()}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                    <span className={`text-xs font-medium capitalize ${paymentColors[order.payment_status] ?? "text-brand-500"}`}>
                      {paymentIcon[order.payment_status] ?? "⏳"} {order.payment_status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-brand-50 text-xs text-brand-400">
                    <span className="truncate">{itemCount(order)} · {order.customer_phone}</span>
                    <span className="shrink-0">{shortDate(order.created_at)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Wide screens: table ─────────────────────────────────────── */}
          <div className="hidden xl:block bg-white border border-brand-100 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-50">
                  {["Reference", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-brand-400 uppercase tracking-wider px-4 py-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-50 transition-colors">
                    <td className="px-4 py-4">
                      <span className="text-xs font-mono font-medium text-brand-700">{order.reference}</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-brand-900">{order.customer_name}</p>
                      <p className="text-xs text-brand-400 mt-0.5">{order.customer_phone}</p>
                    </td>
                    <td className="px-4 py-4 text-brand-600 whitespace-nowrap">
                      {itemCount(order)}
                    </td>
                    <td className="px-4 py-4 font-medium text-brand-900 whitespace-nowrap">
                      KES {order.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-xs font-medium capitalize ${paymentColors[order.payment_status] ?? "text-brand-500"}`}>
                        {paymentIcon[order.payment_status] ?? "⏳"} {order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-brand-400 whitespace-nowrap">
                      {shortDate(order.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/admin/orders/${order.id}`}
                        className="text-xs text-brand-600 hover:text-brand-800 font-medium whitespace-nowrap">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
