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
  paid:    "text-emerald-600",
  pending: "text-yellow-600",
  failed:  "text-red-500",
};

export default async function OrdersPage() {
  let orders: DBOrder[];
  try {
    orders = await getOrders({ limit: 50 });
  } catch {
    orders = [];
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-brand-950">Orders</h1>
          <p className="text-sm text-brand-500 mt-1">{orders.length} total orders</p>
        </div>
      </div>

      <div className="bg-white border border-brand-100 rounded-2xl overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">🛒</p>
            <p className="text-sm font-medium text-brand-600">No orders yet</p>
            <p className="text-xs text-brand-400 mt-1">Orders will appear here once customers checkout</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-50">
                {["Reference", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-brand-400 uppercase tracking-wider px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono font-medium text-brand-700">{order.reference}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-brand-900">{order.customer_name}</p>
                    <p className="text-xs text-brand-400 mt-0.5">{order.customer_phone}</p>
                  </td>
                  <td className="px-5 py-4 text-brand-600">
                    {Array.isArray(order.items) ? order.items.length : 0} item{order.items?.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-5 py-4 font-medium text-brand-900">
                    KES {order.total.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium capitalize ${paymentColors[order.payment_status] ?? "text-brand-500"}`}>
                      {order.payment_status === "paid" ? "✅" : order.payment_status === "failed" ? "❌" : "⏳"}{" "}
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-brand-400">
                    {new Date(order.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/orders/${order.id}`}
                      className="text-xs text-brand-600 hover:text-brand-800 font-medium">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

